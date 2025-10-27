<script setup>
import { computed } from 'vue'
import { useVoiceRecognition } from '@/composables/useVoiceRecognition'

const emit = defineEmits(['task-created'])

const {
  isRecording,
  isProcessing,
  transcript,
  recordingTimeLeft,
  startRecording,
  stopRecording,
  transcribeAndGenerateTask,
} = useVoiceRecognition()

const handleRecordClick = async () => {
  if (!isRecording.value) {
    await startRecording()
  } else {
    stopRecording()
  }
}

const handleGenerate = async () => {
  const task = await transcribeAndGenerateTask()
  if (task) emit('task-created', task)
}

const recordButtonClasses = computed(() => ({
  'voice-input__record-btn': true,
  'voice-input__record-btn--recording': isRecording.value,
  'voice-input__record-btn--idle': !isRecording.value,
}))

const processButtonClasses = computed(() => ({
  'voice-input__process-btn': true,
  'voice-input__process-btn--hidden': isRecording.value || isProcessing.value,
}))

const transcriptClasses = computed(() => ({
  'voice-input__transcript': true,
  'voice-input__transcript--visible': transcript.value,
}))

const processingClasses = computed(() => ({
  'voice-input__processing': true,
  'voice-input__processing--visible': isProcessing.value,
}))
</script>

<template>
  <div class="voice-input">
    <div class="voice-input__controls">
      <button :class="recordButtonClasses" @click="handleRecordClick" :disabled="isProcessing">
        <span class="voice-input__record-icon">
          {{ isRecording ? '🛑' : '🎤' }}
        </span>
        <span class="voice-input__record-text">
          {{ isRecording ? `Parar (${recordingTimeLeft}s)` : 'Gravar voz' }}
        </span>
      </button>

      <button :class="processButtonClasses" @click="handleGenerate" :disabled="isProcessing">
        <span class="voice-input__process-icon">✨</span>
        <span class="voice-input__process-text">Enviar e criar tarefa</span>
      </button>
    </div>

    <div :class="processingClasses">
      <span class="voice-input__processing-spinner">⏳</span>
      <span class="voice-input__processing-text">Processando áudio...</span>
    </div>

    <div :class="transcriptClasses">
      <strong class="voice-input__transcript-label">Transcrição:</strong>
      <span class="voice-input__transcript-text">{{ transcript }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.voice-input {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .dark-mode & {
    background: #2d2d2d;
  }

  &__controls {
    display: flex;
    flex-direction: column;
    gap: 8px;

    @media (min-width: 480px) {
      flex-direction: row;
      align-items: center;
    }
  }

  &__record-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 140px;
    justify-content: center;

    &--idle {
      background: #007bff;
      color: #fff;

      &:hover:not(:disabled) {
        background: #0056b3;
        transform: translateY(-1px);
      }
    }

    &--recording {
      background: #dc3545;
      color: #fff;
      animation: voice-input__pulse 1.5s infinite;

      &:hover:not(:disabled) {
        background: #c82333;
      }
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  }

  &__record-icon {
    font-size: 1.1rem;
  }

  &__record-text {
    font-size: 0.9rem;
    white-space: nowrap;
  }

  &__process-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    border: none;
    border-radius: 6px;
    background: #28a745;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 140px;
    justify-content: center;

    &:hover:not(:disabled) {
      background: #218838;
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    &--hidden {
      display: none;
    }

    @media (min-width: 480px) {
      &--hidden {
        display: flex;
      }
    }
  }

  &__process-icon {
    font-size: 1.1rem;
  }

  &__process-text {
    font-size: 0.9rem;
    white-space: nowrap;
  }

  &__processing {
    display: none;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 4px;
    color: #856404;

    .dark-mode & {
      background: #332701;
      border-color: #665200;
      color: #f1c40f;
    }

    &--visible {
      display: flex;
    }
  }

  &__processing-spinner {
    font-size: 1rem;
  }

  &__processing-text {
    font-size: 0.875rem;
    font-weight: 500;
  }

  &__transcript {
    display: none;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 4px;
    border-left: 4px solid #007bff;

    .dark-mode & {
      background: #3d3d3d;
      border-left-color: #0056b3;
    }

    &--visible {
      display: block;
    }
  }

  &__transcript-label {
    display: block;
    margin-bottom: 4px;
    font-size: 0.875rem;
    color: #495057;

    .dark-mode & {
      color: #ccc;
    }
  }

  &__transcript-text {
    font-size: 0.9rem;
    line-height: 1.4;
    color: #212529;

    .dark-mode & {
      color: #fff;
    }
  }
}

// Animação para o botão de gravação
@keyframes voice-input__pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(220, 53, 69, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(220, 53, 69, 0);
  }
}

// Responsividade
@media (max-width: 479px) {
  .voice-input {
    padding: 12px;

    &__record-btn,
    &__process-btn {
      width: 100%;
      min-width: auto;
    }

    &__record-text,
    &__process-text {
      font-size: 0.85rem;
    }
  }
}

@media (min-width: 768px) {
  .voice-input {
    &__controls {
      flex-direction: row;
    }

    &__process-btn {
      &--hidden {
        display: flex;
      }
    }
  }
}
</style>
