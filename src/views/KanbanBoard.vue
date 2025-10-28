<script setup>
import { onMounted } from 'vue'
import { useKanbanStore } from '@/stores'
import KanbanColumn from '@/components/KanbanColumn.vue'
import VoiceInput from '@/components/VoiceInput.vue'
import DarkModeToggle from '@/components/DarkModeToggle.vue'

const store = useKanbanStore()

const handleTaskMove = ({ taskId, fromColumnId, toColumnId }) => {
  console.log('📦 Evento task-moved recebido:', { taskId, fromColumnId, toColumnId })
  store.moveTask(taskId, fromColumnId, toColumnId)
}

const handleTaskUpdate = ({ taskId, updates }) => {
  console.log('✏️ Evento task-updated recebido:', { taskId, updates })
  store.updateTask(taskId, updates)
}

const handleTaskDelete = (taskId) => {
  console.log('🗑️ Evento task-deleted recebido:', taskId)
  store.deleteTask(taskId)
}

const handleTaskCreated = async (result) => {
  if (result && result.task) {
    const taskData = {
      ...result.task,
      voiceTranscript: result.transcript || '',
    }
    store.addTask(taskData)
  }
}

onMounted(() => {
  store.initializeStore()
})
</script>

<template>
  <div class="kanban-board" :class="{ 'dark-mode': store.darkMode }">
    <div class="kanban-board__header">
      <a
        href="https://github.com/stamorim28/vue-mini-kanban/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h1 class="kanban-board__title">Vue Mini Kanban</h1>
      </a>

      <div class="kanban-board__controls">
        <div class="d-block"><DarkModeToggle /></div>
      </div>
    </div>

    <div class="kanban-board__voice-input">
      <div class="d-none"><DarkModeToggle /></div>
      <VoiceInput @task-created="handleTaskCreated" />
    </div>

    <div v-if="store.isLoading" class="kanban-board__loading">Loading...</div>

    <div class="kanban-board__columns">
      <KanbanColumn
        v-for="column in store.columns"
        :key="column.id"
        :column="column"
        @task-moved="handleTaskMove"
        @task-updated="handleTaskUpdate"
        @task-deleted="handleTaskDelete"
      />
    </div>
  </div>
</template>

<!-- Resto do template e styles permanece igual -->

<style lang="scss" scoped>
.d-none {
  display: none;
}

.d-block {
  display: block;
}

.kanban-board {
  min-height: 100vh;
  padding: 20px;
  background: #f5f5f5;
  transition: background-color 0.3s ease;

  &.dark-mode {
    background: #1a1a1a;
    color: #ffffff;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    a {
      text-decoration: none;
      color: #000;
    }

    .dark-mode & {
      background: #2d2d2d;

      a {
        color: #fff;
      }
    }
  }

  &__voice-input {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
  }

  &__title {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
  }

  &__controls {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  &__stats {
    font-weight: 600;
    color: #666;

    .dark-mode & {
      color: #ccc;
    }
  }

  &__columns {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .d-none {
    display: block;
  }

  .d-block {
    display: none;
  }

  .kanban-board {
    padding: 1.5rem;

    &__header {
      flex-direction: column;
      text-align: center;
    }

    &__controls {
      flex-wrap: wrap;
      justify-content: center;
    }

    &__columns {
      grid-template-columns: 1fr;
    }

    &__voice-input {
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
  }
}
</style>
