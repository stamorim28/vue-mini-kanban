import { vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

// Configura Pinia para todos os testes
const pinia = createPinia()
setActivePinia(pinia)

// Mock para window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock para ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock para navigator.mediaDevices
Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: vi.fn().mockResolvedValue('mock-stream'),
  },
})

// Mock para MediaRecorder
global.MediaRecorder = vi.fn().mockImplementation(() => ({
  start: vi.fn(),
  stop: vi.fn(),
  ondataavailable: vi.fn(),
  onstop: vi.fn(),
  stream: {
    getTracks: vi.fn().mockReturnValue([{ stop: vi.fn() }]),
  },
}))

// Mock para Blob se não estiver disponível
if (typeof Blob === 'undefined') {
  global.Blob = class Blob {
    constructor(parts, options) {
      this.parts = parts
      this.options = options
      this.size = parts.reduce((size, part) => size + part.length, 0)
    }
  }
}

// Mock para fetch global
global.fetch = vi.fn()

// Mock para Blob (se necessário)
global.Blob = vi.fn().mockImplementation((content, options) => ({
  content,
  options,
  size: content ? content[0].length : 0,
}))
