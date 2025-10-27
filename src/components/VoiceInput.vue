<script setup>
import { ref, computed, watch } from 'vue'
import { useVoiceRecognition } from '@/composables/useVoiceRecognition'
import { MicrophoneIcon, TrashIcon, XMarkIcon, PlusIcon } from '@heroicons/vue/24/solid'
import { SemipolarSpinner } from 'epic-spinners'

const emit = defineEmits(['task-created'])

const showModal = ref(false)

const {
  isRecording,
  isProcessing,
  transcript,
  recordingTimeLeft,
  audioBlob,
  startRecording,
  stopRecording,
  transcribeAndGenerateTask,
  clearAudio,
} = useVoiceRecognition()

const fileSize = computed(() => {
  if (!audioBlob.value) return null

  const sizeInBytes = audioBlob.value.size
  if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`
  } else {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`
  }
})

const hasStoredAudio = computed(() => {
  return audioBlob.value !== null
})

const recordButtonDisabled = computed(() => {
  return hasStoredAudio.value || isProcessing.value
})

const sendButtonDisabled = computed(() => {
  return !hasStoredAudio.value || isProcessing.value
})

const recordButtonClasses = computed(() => ({
  'voice-input__record-btn': true,
  'voice-input__record-btn--recording': isRecording.value,
  'voice-input__record-btn--idle': !isRecording.value,
  'voice-input__record-btn--disabled': recordButtonDisabled.value,
}))

const processButtonClasses = computed(() => ({
  'voice-input__process-btn': true,
  'voice-input__process-btn--disabled': sendButtonDisabled.value,
}))

const transcriptClasses = computed(() => ({
  'voice-input__transcript': true,
  'voice-input__transcript--visible': transcript.value,
}))

const handleRecordClick = async () => {
  if (recordButtonDisabled.value) return

  if (!isRecording.value) {
    await startRecording()
  } else {
    stopRecording()
  }
}

const handleGenerate = async () => {
  if (sendButtonDisabled.value) return

  const task = await transcribeAndGenerateTask()
  if (task) {
    emit('task-created', task)
    closeModal()
  }
}

const openModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  clearAudio()
}

const handleClearAudio = () => {
  clearAudio()
}

watch(showModal, (newValue) => {
  if (newValue) {
    clearAudio()
  }
})
</script>

<template>
  <div class="voice-input">
    <button class="voice-input__open-modal-btn" @click="openModal">
      <!-- <span class="voice-input__modal-icon"></span> -->
      <span class="voice-input__modal-text"
        ><PlusIcon style="height: 25px" /> Criar tarefa por voz</span
      >
    </button>

    <!-- Modal -->
    <div v-if="showModal" class="voice-input__modal">
      <div class="voice-input__modal-content">
        <div class="voice-input__modal-header">
          <h3 class="voice-input__modal-title">Criar tarefa por voz</h3>
          <button class="voice-input__modal-close" @click="closeModal">
            <XMarkIcon style="height: 25px" />
          </button>
        </div>

        <div class="voice-input__modal-body">
          <button
            v-if="!isProcessing"
            :class="recordButtonClasses"
            @click="handleRecordClick"
            :disabled="recordButtonDisabled"
            :title="isRecording ? 'Parar gravação' : 'Iniciar gravação'"
          >
            <span class="voice-input__record-icon">
              <MicrophoneIcon v-if="!isRecording" style="height: 80px" />
            </span>
            <span class="voice-input__record-text">
              {{ isRecording ? `${recordingTimeLeft}s` : '' }}
            </span>
          </button>
          <div v-if="isProcessing" class="voice-input__modal-body--loading">
            <SemipolarSpinner :animation-duration="3000" :size="120" :color="'#007bff'" />
            <span>Seu áudio está sendo enviado, aguarde...</span>
          </div>

          <div v-if="hasStoredAudio && !isProcessing" class="voice-input__audio-info">
            <div class="voice-input__file-size">
              <strong>Tamanho do arquivo:</strong> {{ fileSize }}
            </div>
            <button
              class="voice-input__clear-audio"
              @click="handleClearAudio"
              :disabled="isProcessing"
            >
              <TrashIcon style="height: 20px" />
            </button>
          </div>
          <div class="voice-input__controls">
            <button
              v-if="!isProcessing"
              :class="processButtonClasses"
              @click="handleGenerate"
              :disabled="sendButtonDisabled"
            >
              <span class="voice-input__process-text">Enviar e criar tarefa</span>
            </button>
          </div>

          <!-- Transcrição -->
          <div :class="transcriptClasses">
            <strong class="voice-input__transcript-label">Transcrição:</strong>
            <span class="voice-input__transcript-text">{{ transcript }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.voice-input {
  display: inline-block;

  &__modal-text {
    display: flex;
    font-weight: 600;

    svg {
      margin-right: 0.25rem;
    }
  }
}

.voice-input__open-modal-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  background: #007bff;
  color: #fff;

  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 160px;
  justify-content: center;

  &:hover {
    background: #0056b3;
    transform: translateY(-1px);
  }

  .dark-mode & {
    background: #0056b3;

    &:hover {
      background: #004494;
    }
  }
}

.voice-input__modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.voice-input__modal-content {
  position: relative;
  background: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 1001;

  .dark-mode & {
    background: #2d2d2d;
    color: #fff;
  }
}

.voice-input__modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;

  .dark-mode & {
    border-bottom-color: #404040;
  }
}

.voice-input__modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.voice-input__modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #333;
  }

  .dark-mode & {
    color: #ccc;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }
  }
}

.voice-input__modal-body {
  padding: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 16px;

  &--loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    font-size: 1rem;
    color: #495057;

    .dark-mode & {
      color: #ccc;
    }
  }
}

.voice-input__controls {
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 480px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.voice-input__record-btn {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 120px;
  height: 120px;
  border-radius: 100%;
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

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    animation: none !important;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
}

.voice-input__record-icon {
  font-size: 1.1rem;
}

.voice-input__record-text {
  font-size: 2.5rem;
  font-weight: bold;
  white-space: nowrap;
}

.voice-input__process-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  background: #28a745;
  color: #fff;

  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px;
  justify-content: center;
  margin-top: 1rem;

  &:hover:not(:disabled) {
    background: #218838;
    transform: translateY(-1px);
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
}

.voice-input__process-icon {
  font-size: 1.1rem;
}

.voice-input__process-text {
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
}

.voice-input__audio-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #17a2b8;

  .dark-mode & {
    background: #3d3d3d;
    border-left-color: #138496;
  }
}

.voice-input__file-size {
  font-size: 0.9rem;
  color: #495057;
  margin-right: 1rem;

  .dark-mode & {
    color: #ccc;
  }
}

.voice-input__clear-audio {
  background: #6c757d;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 9px 12px 5px 12px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover:not(:disabled) {
    background: #545b62;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.voice-input__processing {
  // display: none;
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

.voice-input__processing-spinner {
  font-size: 1rem;
}

.voice-input__processing-text {
  font-size: 0.875rem;
  font-weight: 500;
}

.voice-input__transcript {
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

.voice-input__transcript-label {
  display: block;
  margin-bottom: 4px;
  font-size: 0.875rem;
  color: #495057;

  .dark-mode & {
    color: #ccc;
  }
}

.voice-input__transcript-text {
  font-size: 0.9rem;
  line-height: 1.4;
  color: #212529;

  .dark-mode & {
    color: #fff;
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
  .voice-input__modal-content {
    width: 95%;
    margin: 20px;
  }

  .voice-input__record-btn,
  .voice-input__process-btn {
    width: 100%;
    min-width: auto;
  }

  .voice-input__record-text,
  .voice-input__process-text {
    font-size: 0.85rem;
  }

  .voice-input__audio-info {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
}

@media (min-width: 768px) {
  .voice-input__controls {
    flex-direction: row;
  }
}
</style>
