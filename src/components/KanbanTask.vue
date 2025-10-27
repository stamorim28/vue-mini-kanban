<script setup>
import { ref, computed } from 'vue'

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

const emit = defineEmits(['task-updated', 'task-deleted'])

const isEditing = ref(false)
const isDragging = ref(false)

const editForm = ref({
  title: '',
  description: '',
  priority: 'medium',
  columnId: 'todo',
})

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

const taskClasses = computed(() => ({
  'kanban-task--dragging': isDragging.value,
  [`kanban-task--${props.task.priority}`]: true,
}))

const isFormValid = computed(() => {
  return editForm.value.title.trim().length > 0
})

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
}

const cancelEdit = () => {
  isEditing.value = false
}

const handleDelete = () => {
  if (confirm('Are you sure you want to delete this task?')) {
    emit('task-deleted', props.task.id)
  }
}

const handleDragStart = (event) => {
  isDragging.value = true
  const data = {
    taskId: props.task.id,
    fromColumnId: props.columnId,
  }
  event.dataTransfer.setData('application/json', JSON.stringify(data))
  event.dataTransfer.effectAllowed = 'move'

  // Efeito visual de drag
  setTimeout(() => {
    event.target.style.opacity = '0.4'
  }, 0)
}

const handleDragEnd = (event) => {
  isDragging.value = false
  event.target.style.opacity = '1'
}
</script>

<template>
  <div>
    <div
      class="kanban-task"
      :class="taskClasses"
      draggable="true"
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
    >
      <div class="kanban-task__header">
        <div class="kanban-task__title" v-html="task.title"></div>
        <div class="kanban-task__actions">
          <button class="kanban-task__edit" @click="toggleEdit" title="Editar">✏️</button>
          <button class="kanban-task__delete" @click="handleDelete" title="Deletar">🗑️</button>
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
      </div>
    </div>

    <div v-if="isEditing" class="kanban-task__modal">
      <div class="kanban-task__modal-content">
        <h3>Editar</h3>

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
            <button type="button" @click="cancelEdit" class="kanban-task__cancel">Cancelar</button>
          </div>
        </form>
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

  .dark-mode & {
    background: #3d3d3d;
    color: #fff;
  }

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }

  &--dragging {
    opacity: 0.5;
    transform: rotate(5deg);
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

  &__edit,
  &__delete {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 3px;
    font-size: 0.875rem;

    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }

    .dark-mode &:hover {
      background: rgba(255, 255, 255, 0.1);
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

  &__modal {
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

  &__modal-content {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;

    .dark-mode & {
      background: #2d2d2d;
      color: #fff;
    }

    form {
      width: 100%;
    }

    h3 {
      margin: 0 0 16px 0;
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

@media (max-width: 768px) {
  .kanban-task {
    padding: 10px;

    &__actions {
      opacity: 1;
    }

    &__modal-content {
      margin: 20px;
      width: calc(100% - 40px);
    }
  }
}
</style>
