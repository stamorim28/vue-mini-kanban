<script setup>
import { ref, computed, inject } from 'vue'
import {
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  MicrophoneIcon,
  ArrowsUpDownIcon,
} from '@heroicons/vue/24/solid'

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
  columnId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['task-updated', 'task-deleted', 'task-move'])

const isEditing = ref(false)
const isDragging = ref(false)
const showModal = ref(false)
const modalType = ref('') // 'edit', 'delete', 'move'

const editForm = ref({
  title: '',
  description: '',
  priority: 'medium',
  columnId: 'todo',
})

const moveForm = ref({
  targetColumnId: '',
})

// ✅ Obter a lista de colunas disponíveis
const kanbanStore = inject('kanbanStore') // Ou importe diretamente se preferir
const columns = [
  { id: 'todo', title: 'A fazer' },
  { id: 'in-progress', title: 'Em desenvolvimento' },
  { id: 'done', title: 'Concluído' },
]

const priorityLabel = computed(() => {
  const labels = {
    low: 'baixa',
    medium: 'média',
    high: 'alta',
  }
  return labels[props.task.priority] || 'Medium'
})

const formattedDate = computed(() => {
  try {
    return new Date(props.task.createdAt).toLocaleDateString('pt-BR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return 'Data desconhecida'
  }
})

const hasVoiceTranscript = computed(() => {
  return props.task.voiceTranscript && props.task.voiceTranscript.trim().length > 0
})

const taskClasses = computed(() => ({
  'kanban-task--dragging': isDragging.value,
  [`kanban-task--${props.task.priority}`]: true,
}))

const isFormValid = computed(() => {
  return editForm.value.title.trim().length > 0
})

const isMoveFormValid = computed(() => {
  return moveForm.value.targetColumnId && moveForm.value.targetColumnId !== props.columnId
})

// ✅ Abrir modal de mover tarefa
const openMoveModal = () => {
  modalType.value = 'move'
  moveForm.value.targetColumnId = '' // Resetar seleção
  showModal.value = true
}

const toggleEdit = () => {
  if (!isEditing.value) {
    editForm.value = {
      title: props.task.title,
      description: props.task.description,
      priority: props.task.priority,
      columnId: props.task.columnId,
    }
  }
  isEditing.value = !isEditing.value
}

const saveEdit = () => {
  if (!isFormValid.value) return

  const updates = { ...editForm.value }

  Object.keys(updates).forEach((key) => {
    if (updates[key] === props.task[key]) {
      delete updates[key]
    }
  })

  if (Object.keys(updates).length > 0) {
    emit('task-updated', {
      taskId: props.task.id,
      updates,
    })
  }

  isEditing.value = false
  closeModal()
}

// ✅ Mover tarefa para outra coluna
const moveTask = () => {
  if (!isMoveFormValid.value) return

  emit('task-move', {
    taskId: props.task.id,
    fromColumnId: props.columnId,
    toColumnId: moveForm.value.targetColumnId,
  })

  closeModal()
}

const cancelEdit = () => {
  isEditing.value = false
  closeModal()
}

const confirmDelete = () => {
  emit('task-deleted', props.task.id)
  closeModal()
}

// Handlers de drag (mantidos para desktop)
const handleDragStart = (event) => {
  isDragging.value = true

  if (event.dataTransfer) {
    const data = {
      taskId: props.task.id,
      fromColumnId: props.columnId,
    }
    event.dataTransfer.setData('application/json', JSON.stringify(data))
    event.dataTransfer.effectAllowed = 'move'
  }

  setTimeout(() => {
    event.target.style.opacity = '0.4'
  }, 0)
}

const handleDragEnd = (event) => {
  isDragging.value = false
  event.target.style.opacity = '1'
}

const openModal = (type) => {
  modalType.value = type
  showModal.value = true

  if (type === 'edit') {
    toggleEdit()
  }
}

const closeModal = () => {
  showModal.value = false
  modalType.value = ''
  isEditing.value = false
  moveForm.value.targetColumnId = ''
}

const modalTitle = computed(() => {
  const titles = {
    edit: 'Editar Tarefa',
    delete: 'Confirmar Exclusão',
    move: 'Mover Tarefa',
  }
  return titles[modalType.value] || ''
})

const currentColumnName = computed(() => {
  const column = columns.find((col) => col.id === props.columnId)
  return column ? column.title : 'Coluna Atual'
})
</script>

<template>
  <div>
    <aside
      class="kanban-task"
      :class="taskClasses"
      draggable="true"
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
    >
      <div class="kanban-task__header">
        <div class="kanban-task__title" v-html="task.title"></div>
        <div class="kanban-task__actions">
          <button class="kanban-task__move" @click="openMoveModal" title="Mover Tarefa">
            <ArrowsUpDownIcon style="height: 20px" />
          </button>
          <button class="kanban-task__edit" @click="openModal('edit')" title="Editar">
            <PencilSquareIcon style="height: 20px" />
          </button>
          <button class="kanban-task__delete" @click="openModal('delete')" title="Deletar">
            <TrashIcon style="height: 20px" />
          </button>
        </div>
      </div>

      <div class="kanban-task__content">
        <div class="kanban-task__description" v-html="task.description"></div>

        <div class="kanban-task__meta">
          <span class="kanban-task__priority" :class="`kanban-task__priority--${task.priority}`">
            {{ priorityLabel }}
          </span>
          <span class="kanban-task__date">
            {{ formattedDate }}
          </span>
        </div>

        <div v-if="hasVoiceTranscript" class="kanban-task__transcript">
          <details class="kanban-task__transcript-details">
            <summary class="kanban-task__transcript-summary">
              <MicrophoneIcon style="height: 16px" />
              Transcrição de voz
            </summary>
            <div class="kanban-task__transcript-content">
              <i>{{ task.voiceTranscript }}</i>
            </div>
          </details>
        </div>
      </div>
    </aside>

    <!-- Modal -->
    <div v-if="showModal" class="voice-input__modal">
      <div class="voice-input__modal-content">
        <div class="voice-input__modal-header">
          <h3 class="voice-input__modal-title">{{ modalTitle }}</h3>
          <button class="voice-input__modal-close" @click="closeModal">
            <XMarkIcon style="height: 25px" />
          </button>
        </div>

        <div class="voice-input__modal-body">
          <!-- Formulário de Edição -->
          <div v-if="modalType === 'edit'">
            <form @submit.prevent="saveEdit">
              <div class="kanban-task__form-group">
                <label>Título:</label>
                <input v-model="editForm.title" type="text" required class="kanban-task__input" />
              </div>

              <div class="kanban-task__form-group">
                <label>Descrição:</label>
                <textarea
                  v-model="editForm.description"
                  rows="3"
                  class="kanban-task__textarea"
                ></textarea>
              </div>

              <div class="kanban-task__form-group">
                <label>Prioridade:</label>
                <select v-model="editForm.priority" class="kanban-task__select">
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>
              </div>

              <div class="kanban-task__modal-actions">
                <button type="submit" class="kanban-task__save">Salvar</button>
                <button type="button" @click="cancelEdit" class="kanban-task__cancel">
                  Cancelar
                </button>
              </div>
            </form>
          </div>

          <!-- Confirmação de Exclusão -->
          <div v-if="modalType === 'delete'" class="delete-confirmation">
            <div class="delete-confirmation__icon">
              <TrashIcon style="height: 48px; color: #dc3545" />
            </div>
            <div class="delete-confirmation__message">
              <p>Tem certeza que deseja excluir a tarefa <strong v-html="task.title"></strong>?</p>
              <p class="delete-confirmation__warning">Esta ação não pode ser desfeita.</p>
            </div>
            <div class="delete-confirmation__actions">
              <button class="delete-confirmation__confirm" @click="confirmDelete">
                Sim, Excluir
              </button>
              <button class="delete-confirmation__cancel" @click="closeModal">Cancelar</button>
            </div>
          </div>

          <!-- Formulário de Movimentação -->
          <div v-if="modalType === 'move'" class="move-confirmation">
            <div class="move-confirmation__icon">
              <ArrowsUpDownIcon style="height: 48px; color: #007bff" />
            </div>
            <div class="move-confirmation__message">
              <p>Mover tarefa <strong v-html="task.title"></strong> para:</p>
              <!-- <p class="move-confirmation__current">
                Atualmente em: <strong>{{ currentColumnName }}</strong>
              </p> -->
            </div>

            <div class="move-confirmation__form">
              <div class="kanban-task__form-group">
                <select v-model="moveForm.targetColumnId" class="kanban-task__select">
                  <option value="" disabled>Selecione uma coluna</option>
                  <option
                    v-for="column in columns"
                    :key="column.id"
                    :value="column.id"
                    :disabled="column.id === columnId"
                  >
                    {{ column.title }} {{ column.id === columnId ? '(Atual)' : '' }}
                  </option>
                </select>
              </div>
            </div>

            <div class="move-confirmation__actions">
              <button
                class="move-confirmation__confirm"
                @click="moveTask"
                :disabled="!isMoveFormValid"
              >
                Mover Tarefa
              </button>
              <button class="move-confirmation__cancel" @click="closeModal">Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.kanban-task {
  background: #fff;
  border-radius: 6px;
  padding: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #6c757d;
  cursor: grab;
  transition: all 0.2s ease;
  position: relative;
  -webkit-tap-highlight-color: transparent;
  touch-action: pan-y;
  user-select: none;

  .dark-mode & {
    background: #3d3d3d;
    color: #fff;
  }

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }

  &--dragging {
    opacity: 0.4;
    transform: scale(0.95) rotate(3deg);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 1000;
  }

  &--high {
    border-left-color: #dc3545;
  }

  &--medium {
    border-left-color: #ffc107;
  }

  &--low {
    border-left-color: #28a745;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }

  &__title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.3;
    flex: 1;
    margin-right: 8px;
  }

  &__actions {
    display: flex;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover &__actions {
    opacity: 1;
  }

  &__move,
  &__edit,
  &__delete {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 3px;
    font-size: 0.875rem;
    color: #666;

    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }

    .dark-mode & {
      color: #fff;
    }

    .dark-mode &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }
  }

  &__content {
    font-size: 0.875rem;
  }

  &__description {
    margin: 0 0 8px 0;
    color: #666;
    line-height: 1.4;

    .dark-mode & {
      color: #ccc;
    }
  }

  &__transcript {
    margin-top: 1rem;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    overflow: hidden;

    .dark-mode & {
      border-color: #404040;
    }
  }

  &__transcript-details {
    background: #f8f9fa;

    .dark-mode & {
      background: #2d2d2d;
    }
  }

  &__transcript-summary {
    padding: 8px 12px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background-color 0.2s ease;

    &:hover {
      background: #e9ecef;
    }

    .dark-mode & {
      color: #fff;

      &:hover {
        background: #404040;
      }
    }
  }

  &__transcript-icon {
    font-size: 0.9rem;
  }

  &__transcript-content {
    padding: 12px;
    background: #f8f9fa;
    border-top: 1px solid #e9ecef;
    font-size: 0.8rem;
    line-height: 1.4;
    color: #495057;

    .dark-mode & {
      background: #2d2d2d;
      border-top-color: #404040;
      color: #ccc;
    }
  }

  &__meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;
  }

  &__priority {
    padding: 2px 6px;
    border-radius: 10px;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.7rem;

    &--high {
      background: #dc3545;
      color: #fff;
    }

    &--medium {
      background: #ffc107;
      color: #000;
    }

    &--low {
      background: #28a745;
      color: #fff;
    }
  }

  &__date {
    color: #999;

    .dark-mode & {
      color: #888;
    }
  }

  &__form-group {
    width: 100%;
    margin-bottom: 12px;

    label {
      display: block;
      margin-bottom: 4px;
      font-weight: 600;
    }
  }

  &__input,
  &__textarea,
  &__select {
    width: -webkit-fill-available;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: inherit;

    .dark-mode & {
      background: #3d3d3d;
      border-color: #555;
      color: #fff;
    }
  }

  &__modal-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    margin-top: 16px;
  }

  &__save,
  &__cancel {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
  }

  &__save {
    background: #007bff;
    color: #fff;

    &:hover {
      background: #0056b3;
    }
  }

  &__cancel {
    background: #6c757d;
    color: #fff;

    &:hover {
      background: #545b62;
    }
  }
}

.voice-input__modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.voice-input__modal-content {
  position: relative;
  background: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 1001;

  .dark-mode & {
    background: #2d2d2d;
    color: #fff;
  }
}

.voice-input__modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;

  .dark-mode & {
    border-bottom-color: #404040;
  }
}

.voice-input__modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.voice-input__modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #333;
  }

  .dark-mode & {
    color: #ccc;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }
  }
}

.voice-input__modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  form {
    width: 100%;
  }
}

.move-confirmation {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 20px;

  &__icon {
    display: flex;
    justify-content: center;
  }

  &__message {
    p {
      margin: 0 0 8px 0;
      font-size: 1rem;
      line-height: 1.5;
    }
  }

  &__current {
    color: #6c757d;
    font-size: 0.9rem !important;

    .dark-mode & {
      color: #ccc;
    }
  }

  &__form {
    text-align: left;
  }

  &__actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 1rem;
  }

  &__confirm,
  &__cancel {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    min-width: 140px;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
    }
  }

  &__confirm {
    background: #007bff;
    color: #fff;

    &:hover:not(:disabled) {
      background: #0056b3;
      transform: translateY(-1px);
    }
  }

  &__cancel {
    background: #6c757d;
    color: #fff;

    &:hover {
      background: #545b62;
      transform: translateY(-1px);
    }
  }
}

.delete-confirmation {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 20px;

  &__icon {
    display: flex;
    justify-content: center;
  }

  &__message {
    p {
      margin: 0 0 8px 0;
      font-size: 1rem;
      line-height: 1.5;

      div {
        h2 {
          font-size: 1rem !important;
        }
      }
    }
  }

  &__warning {
    color: #dc3545;
    font-size: 0.9rem !important;
    font-weight: 600;

    .dark-mode & {
      color: #ff6b6b;
    }
  }

  &__actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }

  &__confirm,
  &__cancel {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    min-width: 120px;
  }

  &__confirm {
    background: #dc3545;
    color: #fff;

    &:hover {
      background: #c82333;
      transform: translateY(-1px);
    }
  }

  &__cancel {
    background: #6c757d;
    color: #fff;

    &:hover {
      background: #545b62;
      transform: translateY(-1px);
    }
  }
}

@media (max-width: 768px) {
  .kanban-task {
    padding: 10px;

    &__actions {
      opacity: 1;
    }
  }

  .delete-confirmation__actions {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
}

@media (max-width: 480px) {
  .voice-input__modal-content {
    width: 95%;
    margin: 20px;
  }
}
</style>
