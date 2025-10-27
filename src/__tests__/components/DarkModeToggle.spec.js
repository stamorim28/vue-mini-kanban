// src/__tests__/components/DarkModeToggle.simple.spec.js
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DarkModeToggle from '@/components/DarkModeToggle.vue'

vi.mock('@/stores', () => ({
  useKanbanStore: () => ({
    darkMode: false,
    toggleDarkMode: vi.fn(),
  }),
}))

describe('DarkModeToggle', () => {
  it('renderiza botão', () => {
    const wrapper = mount(DarkModeToggle)
    expect(wrapper.find('button').exists()).toBe(true)
  })
})
