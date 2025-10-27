// src/__tests__/composables/useVoiceRecognition.simple.spec.js
import { describe, it, expect, vi } from 'vitest'

// Mock global básico
vi.stubGlobal('alert', vi.fn())

describe('useVoiceRecognition (Muito Simples)', () => {
  it('função existe', async () => {
    // Mock básico para evitar problemas complexos
    vi.stubGlobal('MediaRecorder', vi.fn())
    vi.stubGlobal('navigator', { mediaDevices: { getUserMedia: vi.fn() } })

    const { useVoiceRecognition } = await import('@/composables/useVoiceRecognition')
    const composable = useVoiceRecognition()

    expect(typeof composable.startRecording).toBe('function')
    expect(typeof composable.stopRecording).toBe('function')
  })
})
