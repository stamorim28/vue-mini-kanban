// src/__tests__/App.simple.spec.js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import App from '@/App.vue'

describe('App', () => {
  it('monta sem erros', () => {
    const pinia = createPinia()
    const wrapper = mount(App, {
      global: { plugins: [pinia] },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
