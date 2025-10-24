<script setup>
import { ref, computed } from 'vue'
</script>

<template>
  <div class="kanban-board">
    <div class="kanban-board__header">
      <h1 class="kanban-board__title">Vue Mini Kanban</h1>
      <div class="kanban-board__controls">
        <div class="kanban-board__stats">
          <span>Progresso: 25%</span>
        </div>
      </div>
    </div>

    <div class="kanban-board__columns"></div>

    <div class="kanban-board__error">
      <button>x</button>
      <span
        >Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus impedit doloremque
        placeat!</span
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
    margin-bottom: 30px;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .dark-mode & {
      background: #2d2d2d;
    }
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

  &__error {
    max-width: 300px;
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px;
    background: #ff4757;
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    button {
      width: fit-content;
      background: transparent;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      align-self: flex-end;
      margin-bottom: 0.5rem;
      color: #fff;
      font-weight: bold;
      font-size: 1.5rem;
    }

    span {
      font-size: 1.125rem;
    }
  }
}

@media (max-width: 768px) {
  .kanban-board {
    padding: 10px;

    &__header {
      flex-direction: column;
      gap: 15px;
      text-align: center;
    }

    &__controls {
      flex-wrap: wrap;
      justify-content: center;
    }

    &__columns {
      grid-template-columns: 1fr;
    }
  }
}
</style>
