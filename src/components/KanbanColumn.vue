<script setup>
import { ref } from 'vue'
</script>

<template>
  <div class="kanban-column">
    <div class="kanban-column__header">
      <h3 class="kanban-column__title">Titulo</h3>
      <span class="kanban-column__count">3</span>
    </div>

    <div class="kanban-column__tasks">
      <div class="kanban-column__drop-zone">Solte aqui</div>
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
    color: white;
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
