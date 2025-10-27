// src/__tests__/stores/kanbanStore.simple.spec.js
import { describe, it, expect, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useKanbanStore } from '@/stores'

// Mock simples
vi.mock('@/composables/useIndexedDB', () => ({
  indexedDB: {
    saveStoreData: vi.fn(),
  },
}))

describe('Kanban Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('inicializa com colunas padrão', () => {
    const store = useKanbanStore()
    expect(store.columns).toHaveLength(3)
    expect(store.columns[0].title).toBe('A fazer')
  })

  it('toggleDarkMode alterna o modo escuro', () => {
    const store = useKanbanStore()
    expect(store.darkMode).toBe(false)

    store.toggleDarkMode()
    expect(store.darkMode).toBe(true)

    store.toggleDarkMode()
    expect(store.darkMode).toBe(false)
  })
})
