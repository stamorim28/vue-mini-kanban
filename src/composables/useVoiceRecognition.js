import { ref, onUnmounted } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

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
      toast.error('Não foi possível acessar o microfone.', {
        position: toast.POSITION.TOP_RIGHT,
        theme: 'colored',
        autoClose: 5000,
        toastStyle: {
          fontSize: '14px',
        },
      })
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
        toast.error('Não foi possível parar a gravação.', {
          position: toast.POSITION.TOP_RIGHT,
          theme: 'colored',
          autoClose: 5000,
          toastStyle: {
            fontSize: '14px',
          },
        })
      }
      isRecording.value = false
      console.log('%c🟢 Gravação encerrada', 'color: green; font-weight: bold;')
    }
  }

  const clearAudio = () => {
    audioBlob.value = null
    audioChunks.value = []
    transcript.value = ''
    console.log('%c🧹 Áudio limpo', 'color: orange; font-weight: bold;')
  }

  const transcribeAndGenerateTask = async () => {
    if (!audioBlob.value) {
      toast.error('Nenhum áudio foi gravado para ser enviado.', {
        position: toast.POSITION.TOP_RIGHT,
        theme: 'colored',
        autoClose: 5000,
        toastStyle: {
          fontSize: '14px',
        },
      })
      return null
    }

    try {
      isProcessing.value = true
      console.log('📤 Enviando áudio para backend...')

      const formData = new FormData()
      formData.append('audio', audioBlob.value, 'voice.webm')

      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const text = await response.text().catch(() => null)
        toast.error('Falha na comunicação com o servidor.', {
          position: toast.POSITION.TOP_RIGHT,
          theme: 'colored',
          autoClose: 5000,
          toastStyle: {
            fontSize: '14px',
          },
        })
        throw new Error(
          `Falha na comunicação com o servidor. Status ${response.status} - ${text || ''}`,
        )
      }

      const data = await response.json()
      transcript.value = data.transcript || ''
      console.log('🧠 Transcrição:', transcript.value)
      console.log('📦 Tarefa gerada:', data.task)

      return {
        task: data.task,
        transcript: transcript.value,
      }
    } catch (err) {
      console.error('Erro ao gerar tarefa via backend:', err)
      toast.error('Não foi possível criar a tarefa.', {
        position: toast.POSITION.TOP_RIGHT,
        theme: 'colored',
        autoClose: 5000,
        toastStyle: {
          fontSize: '14px',
        },
      })
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
    audioBlob,
    startRecording,
    stopRecording,
    transcribeAndGenerateTask,
    clearAudio,
  }
}
