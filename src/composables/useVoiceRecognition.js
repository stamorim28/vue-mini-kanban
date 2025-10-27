import { ref, onUnmounted } from 'vue'

export function useVoiceRecognition() {
  const isRecording = ref(false)
  const isProcessing = ref(false)
  const transcript = ref('')
  const mediaRecorder = ref(null)
  const audioChunks = ref([])
  const audioBlob = ref(null)
  const recordingTimer = ref(null)
  const recordingTimeLeft = ref(30)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.value = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' })
      audioChunks.value = []
      recordingTimeLeft.value = 30

      mediaRecorder.value.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) audioChunks.value.push(event.data)
      }

      mediaRecorder.value.onstop = () => {
        audioBlob.value = new Blob(audioChunks.value, { type: 'audio/webm' })
        console.log('🎧 Áudio gravado (blob):', audioBlob.value)
      }

      mediaRecorder.value.start()
      isRecording.value = true
      console.log('%c🎤 Gravação iniciada (limite 30s)', 'color: red; font-weight: bold;')

      recordingTimer.value = setInterval(() => {
        recordingTimeLeft.value--
        if (recordingTimeLeft.value <= 0) {
          stopRecording()
        }
      }, 1000)
    } catch (err) {
      console.error('Erro ao acessar o microfone:', err)
      alert('Não foi possível acessar o microfone.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.value && isRecording.value) {
      clearInterval(recordingTimer.value)
      try {
        mediaRecorder.value.stop()
        const tracks = mediaRecorder.value.stream?.getTracks() || []
        tracks.forEach((t) => t.stop())
      } catch (e) {
        console.warn('Erro ao parar MediaRecorder:', e)
      }
      isRecording.value = false
      console.log('%c🟢 Gravação encerrada', 'color: green; font-weight: bold;')
    }
  }

  const transcribeAndGenerateTask = async () => {
    if (!audioBlob.value) {
      alert('Nenhum áudio gravado para enviar.')
      return null
    }

    try {
      isProcessing.value = true
      console.log('📤 Enviando áudio para backend...')

      const formData = new FormData()
      formData.append('audio', audioBlob.value, 'voice.webm')

      const response = await fetch(process.env.VUE_APP_API_URL, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const text = await response.text().catch(() => null)
        throw new Error(
          `Falha na comunicação com o servidor. Status ${response.status} - ${text || ''}`,
        )
      }

      const data = await response.json()
      transcript.value = data.transcript || ''
      console.log('🧠 Transcrição:', transcript.value)
      console.log('📦 Tarefa gerada:', data.task)
      return data.task
    } catch (err) {
      console.error('Erro ao gerar tarefa via backend:', err)
      alert('Erro ao gerar a tarefa via backend.')
      return null
    } finally {
      isProcessing.value = false
    }
  }

  onUnmounted(() => {
    clearInterval(recordingTimer.value)
    if (mediaRecorder.value && isRecording.value) stopRecording()
  })

  return {
    isRecording,
    isProcessing,
    transcript,
    recordingTimeLeft,
    startRecording,
    stopRecording,
    transcribeAndGenerateTask,
  }
}
