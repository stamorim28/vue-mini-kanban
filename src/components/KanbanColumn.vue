<script setup>
import { ref } from 'vue'
import KanbanTask from '@/components/KanbanTask.vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const props = defineProps({
  column: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['task-moved', 'task-updated', 'task-deleted'])

const isDragOver = ref(false)

const handleDragOver = (event) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragEnter = (event) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (event) => {
  if (!event.currentTarget.contains(event.relatedTarget)) {
    isDragOver.value = false
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragOver.value = false

  try {
    const data = JSON.parse(event.dataTransfer.getData('application/json'))

    if (data.fromColumnId !== props.column.id) {
      emit('task-moved', {
        taskId: data.taskId,
        fromColumnId: data.fromColumnId,
        toColumnId: props.column.id,
      })
    }
  } catch (error) {
    toast.error('Não foi possível mover sua tarefa.', {
      position: toast.POSITION.TOP_RIGHT,
      theme: 'colored',
      autoClose: 5000,
      toastStyle: {
        fontSize: '14px',
      },
    })
  }
}

const handleTaskUpdate = ({ taskId, updates }) => {
  emit('task-updated', { taskId, updates })
}

const handleTaskDelete = (taskId) => {
  emit('task-deleted', taskId)
}
</script>

<template>
  <div class="kanban-column">
    <div class="kanban-column__header">
      <h3 class="kanban-column__title">{{ column.title }}</h3>
      <span class="kanban-column__count">{{ column.tasks.length }}</span>
    </div>

    <div
      class="kanban-column__tasks"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
    >
      <KanbanTask
        v-for="task in column.tasks"
        :key="task.id"
        :task="task"
        :column-id="column.id"
        @task-updated="handleTaskUpdate"
        @task-deleted="handleTaskDelete"
      />
      <div v-if="isDragOver" class="kanban-column__drop-zone">Solte aqui</div>
      <div v-if="column.tasks.length === 0 && !isDragOver" class="kanban-column__empty">
        Nenhuma tarefa nesta coluna.
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.kanban-column {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 400px;

  .dark-mode & {
    background: #2d2d2d;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid #e9ecef;

    .dark-mode & {
      border-bottom-color: #404040;
    }
  }

  &__title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;

    .dark-mode & {
      color: #fff;
    }
  }

  &__count {
    background: #007bff;
    color: #fff;
    border-radius: 12px;
    padding: 4px 8px;
    font-size: 0.875rem;
    font-weight: 600;
  }

  &__tasks {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-height: 200px;
    position: relative;
  }

  &__drop-zone {
    border: 2px dashed #007bff;
    border-radius: 6px;
    padding: 20px;
    text-align: center;
    color: #007bff;
    background: rgba(0, 123, 255, 0.1);
    font-weight: 600;
  }

  &__empty {
    text-align: center;
    padding: 40px 20px;
    color: #999;
    font-style: italic;

    .dark-mode & {
      color: #666;
    }
  }
}

.kanban-column--todo {
  .kanban-column__count {
    background: #6c757d;
  }
}

.kanban-column--in-progress {
  .kanban-column__count {
    background: #ffc107;
    color: #000;
  }
}

.kanban-column--done {
  .kanban-column__count {
    background: #28a745;
  }
}

@media (max-width: 768px) {
  .kanban-column {
    padding: 12px;

    &__header {
      flex-direction: column;
      gap: 8px;
      text-align: center;
    }
  }
}
</style>
