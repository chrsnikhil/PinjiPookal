"use client"

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MicOff } from 'lucide-react'
import type { Personality } from '@/lib/ai'
import { useVoiceAssistant, type VoiceAssistantConfig } from '@/lib/voice-assistant'

interface VoiceModalProps {
  isOpen: boolean
  personality: Personality
  onClose: () => void
}

export default function VoiceModal({ isOpen, personality, onClose }: VoiceModalProps) {
  const config: VoiceAssistantConfig = {
    personality: personality.id,
    voice: 'en_US-amy-low',
  }

  const { voiceState, startListening, stopListening } = useVoiceAssistant(config)

  // Auto-start/stop listening when modal opens/closes
  useEffect(() => {
    if (!isOpen) return
    ;(async () => {
      await startListening()
    })()
    return () => {
      stopListening()
    }
  }, [isOpen, startListening, stopListening])

  // Log transcripts and responses explicitly
  useEffect(() => {
    if (voiceState.transcript) {
      console.log('📝 VoiceModal transcript:', voiceState.transcript)
    }
  }, [voiceState.transcript])

  useEffect(() => {
    if (voiceState.response) {
      console.log('💬 VoiceModal AI response:', voiceState.response)
    }
  }, [voiceState.response])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 backdrop-blur-sm bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-2xl"
            initial={{ scale: 0.96, y: 12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 12, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="rounded-3xl border border-white/20 backdrop-blur-md shadow-xl p-6"
                 style={{ backgroundColor: `${personality.color}10`, color: personality.textColor }}>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{personality.icon}</div>
                  <div>
                    <div className="text-xl font-semibold">Voice Assistant</div>
                    <div className="text-sm opacity-75">{personality.name} is listening</div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl border border-white/20 hover:opacity-80"
                  aria-label="Close voice assistant"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Status pill */}
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: personality.color }}
                  animate={voiceState.isListening ? { scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }
                    : voiceState.isProcessing ? { scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }
                    : voiceState.isSpeaking ? { scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }
                    : { scale: 1, opacity: 0.5 }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <div className="text-sm">
                  {voiceState.isListening ? 'Listening…'
                    : voiceState.isProcessing ? 'Processing…'
                    : voiceState.isSpeaking ? 'Speaking…'
                    : 'Idle'}
                </div>
              </div>

              {/* Transcript */}
              <div className="mb-4">
                <div className="text-xs opacity-70 mb-1">You said</div>
                <div className="rounded-2xl p-3 border border-white/20"
                     style={{ backgroundColor: `${personality.color}08` }}>
                  {voiceState.transcript || <span className="opacity-50">Waiting for audio…</span>}
                </div>
              </div>

              {/* Response */}
              <div>
                <div className="text-xs opacity-70 mb-1">{personality.name} says</div>
                <div className="rounded-2xl p-3 border border-white/20"
                     style={{ backgroundColor: `${personality.color}12` }}>
                  {voiceState.response || <span className="opacity-50">Processing…</span>}
                </div>
              </div>

              {/* Footer controls */}
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={stopListening}
                  className="px-4 py-2 rounded-xl border border-white/20 hover:opacity-80"
                  style={{ backgroundColor: `${personality.color}12` }}
                >
                  <span className="inline-flex items-center gap-2"><MicOff size={16} /> Stop</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-white/20 hover:opacity-80"
                  style={{ backgroundColor: `${personality.color}18` }}
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
