<script setup>
import { ref } from 'vue'
</script>

<template>
  <div class="voice-input">
    <button class="voice-input__button">
      <span>🎤</span>
      <span>🔴</span>
    </button>

    <div class="voice-input__transcript">
      <div class="voice-input__actions">
        <button class="voice-input__confirm">Criar tarefa</button>
      </div>
    </div>

    <div class="voice-input__error">Erro: Seu navegador não suporta reconhecimento de voz.</div>
  </div>
</template>

<style lang="scss" scoped>
.voice-input {
  position: relative;

  &__button {
    padding: 10px 15px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;

    &:hover:not(:disabled) {
      background: #0056b3;
    }

    &:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }

    &--listening {
      background: #dc3545;
      animation: pulse 1.5s infinite;

      &:hover {
        background: #c82333;
      }
    }
  }

  &__transcript {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 10px;
    padding: 15px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;

    .dark-mode & {
      background: #2d2d2d;
      color: white;
    }

    p {
      margin: 0 0 10px 0;
      font-style: italic;
      color: #666;

      .dark-mode & {
        color: #ccc;
      }
    }
  }

  &__actions {
    display: flex;
    gap: 10px;
  }

  &__confirm,
  &__cancel {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
  }

  &__confirm {
    background: #28a745;
    color: white;

    &:hover {
      background: #218838;
    }
  }

  &__cancel {
    background: #6c757d;
    color: white;

    &:hover {
      background: #545b62;
    }
  }

  &__error {
    margin-top: 5px;
    color: #dc3545;
    font-size: 0.9rem;
  }
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .voice-input {
    &__transcript {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      max-width: 300px;
    }
  }
}
</style>
