// src/__tests__/components/KanbanTask.simple.spec.js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KanbanTask from '@/components/KanbanTask.vue'

describe('KanbanTask', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    priority: 'medium',
    columnId: 'todo',
    createdAt: new Date().toISOString(),
  }

  it('renderiza task com título', () => {
    const wrapper = mount(KanbanTask, {
      props: { task: mockTask, columnId: 'todo' },
    })
    expect(wrapper.text()).toContain('Test Task')
  })

  it('mostra prioridade', () => {
    const wrapper = mount(KanbanTask, {
      props: { task: mockTask, columnId: 'todo' },
    })
    expect(wrapper.text()).toContain('média')
  })
})
