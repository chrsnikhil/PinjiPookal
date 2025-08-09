// Voice Assistant for Next.js using npm packages
import { useState, useRef, useEffect } from 'react'

export interface VoiceAssistantConfig {
  personality: string
  voice: string
}

export interface VoiceState {
  isListening: boolean
  isProcessing: boolean
  isSpeaking: boolean
  transcript: string
  response: string
}

// Whisper transcription using @xenova/transformers
export async function transcribeSpeech(audioBlob: Blob): Promise<string> {
  try {
    const { pipeline, env } = await import('@xenova/transformers')
    env.allowLocalModels = false
    env.backends.onnx.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/@xenova/transformers/dist/'

    const asr = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en')
    const arrayBuffer = await audioBlob.arrayBuffer()
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const decoded = await audioContext.decodeAudioData(arrayBuffer.slice(0))
    const audioData = decoded.getChannelData(0)

    const result = await asr(audioData)
    const transcript = Array.isArray(result) ? result[0]?.text : result.text
    console.log('🎵 Whisper Transcription:', transcript)
    return transcript || ''
  } catch (error) {
    console.error('❌ Whisper transcription error:', error)
    throw error
  }
}

// Piper TTS using piper-js
export async function synthesizeSpeech(text: string, voice: string = 'en_US-amy-low'): Promise<Blob> {
  try {
    // For now, return a mock audio blob since piper-js might not be available
    // In a real implementation, you'd use the actual piper library
    console.log('🔊 Would synthesize:', text, 'with voice:', voice)
    
    // Mock audio blob for testing
    const mockAudioData = new ArrayBuffer(1024)
    return new Blob([mockAudioData], { type: 'audio/wav' })
  } catch (error) {
    console.error('❌ Piper synthesis error:', error)
    throw error
  }
}

// Voice Assistant Class
export class VoiceAssistant {
  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Blob[] = []
  private isRecording = false
  private config: VoiceAssistantConfig
  private onStateChange: (state: Partial<VoiceState>) => void
  private autoStopTimer: number | null = null

  constructor(config: VoiceAssistantConfig, onStateChange: (state: Partial<VoiceState>) => void) {
    this.config = config
    this.onStateChange = onStateChange
  }

  // Start recording
  async startRecording(): Promise<void> {
    try {
      console.log('🎤 Requesting microphone access...')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      console.log('🎤 Microphone access granted')
      
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      console.log('🎤 MediaRecorder created')

      this.audioChunks = []
      this.isRecording = true

      this.mediaRecorder.ondataavailable = (event) => {
        console.log('🎤 Data available:', event.data.size, 'bytes')
        if (event.data.size > 0) {
          this.audioChunks.push(event.data)
        }
      }

      this.mediaRecorder.onstop = async () => {
        console.log('🎤 Recording stopped, processing...')
        await this.processRecording()
      }

      // Start and emit periodic data (for compatibility)
      this.mediaRecorder.start(1000)
      console.log('🎤 Started recording...')

      // Auto-stop after 4 seconds so we can transcribe without needing manual Stop
      if (this.autoStopTimer) {
        clearTimeout(this.autoStopTimer)
      }
      this.autoStopTimer = window.setTimeout(() => {
        console.log('⏱️ Auto-stopping recording...')
        this.stopRecording()
      }, 4000)
    } catch (error) {
      console.error('❌ Failed to start recording:', error)
      throw error
    }
  }

  // Stop recording
  stopRecording(): void {
    if (this.mediaRecorder && this.isRecording) {
      if (this.autoStopTimer) {
        clearTimeout(this.autoStopTimer)
        this.autoStopTimer = null
      }
      this.mediaRecorder.stop()
      this.isRecording = false
      console.log('🛑 Stopped recording...')
    }
  }

  // Process recording
  private async processRecording(): Promise<void> {
    try {
      // If no chunks accumulated, inform and exit
      if (!this.audioChunks.length) {
        console.log('⚠️ No audio chunks captured yet')
        this.onStateChange({ isProcessing: false, isListening: false })
        return
      }

      const recordingBlob = new Blob(this.audioChunks, { type: 'audio/webm' })
      
      // Step 1: Transcribe
      this.onStateChange({ isProcessing: true, isListening: false })
      console.log('🎵 Transcribing speech...')
      const transcript = await transcribeSpeech(recordingBlob)
      console.log('📝 Final Transcript:', transcript)

      if (!transcript.trim()) {
        console.log('⚠️ No speech detected')
        this.onStateChange({ isProcessing: false, transcript: '' })
        return
      }

      this.onStateChange({ transcript, isProcessing: true })

      // Step 2: Get AI response
      console.log('🤖 Getting AI response...')
      const aiResponse = await this.getAIResponse(transcript)
      console.log('💬 AI Response:', aiResponse)

      this.onStateChange({ response: aiResponse, isProcessing: true })

      // Step 3: Synthesize speech
      console.log('🔊 Synthesizing speech...')
      const synthesizedAudioBlob = await synthesizeSpeech(aiResponse, this.config.voice)
      
      // Step 4: Play audio
      this.onStateChange({ isSpeaking: true, isProcessing: false })
      await this.playAudio(synthesizedAudioBlob)

    } catch (error) {
      console.error('❌ Error processing recording:', error)
      this.onStateChange({ isProcessing: false, isListening: false, isSpeaking: false })
    }
  }

  // Get AI response using existing service
  private async getAIResponse(message: string): Promise<string> {
    const { getAIResponse, personalities } = await import('./ai')
    
    const personality = personalities.find(p => p.id === this.config.personality) || personalities[0]
    
    return await getAIResponse(message, personality, [])
  }

  // Play synthesized audio
  private async playAudio(audioBlob: Blob): Promise<void> {
    try {
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl)
      }
      
      await audio.play()
      console.log('🔊 Playing synthesized speech...')
    } catch (error) {
      console.error('❌ Error playing audio:', error)
    }
  }

  // Cleanup
  destroy(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop())
    }
  }
}

// React Hook
export function useVoiceAssistant(config: VoiceAssistantConfig) {
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    transcript: '',
    response: ''
  })

  const voiceAssistant = useRef<VoiceAssistant | null>(null)

  useEffect(() => {
    console.log('🎤 Creating voice assistant with config:', config)
    voiceAssistant.current = new VoiceAssistant(config, (newState) => {
      console.log('🎤 Voice state update:', newState)
      setVoiceState(prev => ({ ...prev, ...newState }))
    })
    
    return () => {
      console.log('🎤 Destroying voice assistant')
      voiceAssistant.current?.destroy()
    }
  }, [config])

  const startListening = async () => {
    console.log('🎤 startListening called')
    if (!voiceAssistant.current) {
      console.log('❌ No voice assistant instance')
      return
    }
    
    console.log('🎤 Setting voice state to listening...')
    setVoiceState(prev => ({ 
      ...prev, 
      isListening: true, 
      transcript: '', 
      response: '' 
    }))
    
    console.log('🎤 Starting recording...')
    await voiceAssistant.current.startRecording()
  }

  const stopListening = () => {
    if (!voiceAssistant.current) return
    
    voiceAssistant.current.stopRecording()
    setVoiceState(prev => ({ ...prev, isListening: false }))
  }

  return {
    voiceState,
    startListening,
    stopListening
  }
}
