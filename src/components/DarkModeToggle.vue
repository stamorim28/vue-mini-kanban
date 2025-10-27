<script setup>
import { useKanbanStore } from '@/stores'
import { MoonIcon, SunIcon } from '@heroicons/vue/24/solid'

const store = useKanbanStore()
</script>

<template>
  <button
    @click="store.toggleDarkMode()"
    class="dark-mode-toggle"
    :class="{ 'dark-mode-toggle--active': store.darkMode }"
  >
    <MoonIcon v-if="store.darkMode" style="height: 25px" />
    <SunIcon v-if="!store.darkMode" style="height: 25px" />
  </button>
</template>

<style lang="scss" scoped>
.dark-mode-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  color: #333;

  &:hover {
    background: #e9ecef;
    border-color: #dee2e6;
  }

  &--active {
    background: #495057;
    border-color: #343a40;
    color: #fff;

    &:hover {
      background: #343a40;
    }
  }

  &__icon {
    font-size: 1.1rem;
  }

  &__label {
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .dark-mode-toggle {
    padding: 8px 12px;

    &__label {
      display: none;
    }
  }
}
</style>
