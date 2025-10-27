// src/__tests__/composables/useIndexedDB.simple.spec.js
import { describe, it, expect } from 'vitest'

describe('useIndexedDB (Muito Simples)', () => {
  it('funções existem', async () => {
    const { indexedDB } = await import('@/composables/useIndexedDB')

    expect(typeof indexedDB.saveStoreData).toBe('function')
    expect(typeof indexedDB.getStoreData).toBe('function')
    expect(typeof indexedDB.clearStore).toBe('function')
  })
})
