// src/__tests__/components/KanbanColumn.simple.spec.js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KanbanColumn from '@/components/KanbanColumn.vue'

describe('KanbanColumn', () => {
  const mockColumn = {
    id: 'todo',
    title: 'A fazer',
    tasks: [],
  }

  it('renderiza coluna com título', () => {
    const wrapper = mount(KanbanColumn, {
      props: { column: mockColumn },
    })
    expect(wrapper.text()).toContain('A fazer')
  })

  it('mostra mensagem quando vazio', () => {
    const wrapper = mount(KanbanColumn, {
      props: { column: mockColumn },
    })
    expect(wrapper.text()).toContain('Nenhuma tarefa')
  })
})
