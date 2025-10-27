// src/__tests__/views/KanbanBoard.simple.spec.js
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import KanbanBoard from '@/views/KanbanBoard.vue'
import { createPinia } from 'pinia'

vi.mock('@/stores', () => ({
  useKanbanStore: () => ({
    columns: [],
    darkMode: false,
    isLoading: false,
    error: null,
    initializeStore: vi.fn(),
    moveTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    addTask: vi.fn(),
    clearError: vi.fn(),
  }),
}))

describe('KanbanBoard', () => {
  it('renderiza título', () => {
    const pinia = createPinia()
    const wrapper = mount(KanbanBoard, {
      global: { plugins: [pinia] },
    })
    expect(wrapper.text()).toContain('Vue Mini Kanban')
  })
})
