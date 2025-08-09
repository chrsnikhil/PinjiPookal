'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Send, X, Volume2, VolumeX } from 'lucide-react'
import { personalities, getAIResponse, type Personality } from '@/lib/ai'
import { validateAndExecute } from '@/lib/tools'
import VoiceModal from '@/components/voice-modal'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  // Optional tool proposal/result metadata
  proposal?: {
    tool: string
    args: any
    why?: string
    status?: 'pending' | 'accepted' | 'declined'
  }
  toolResult?: any
}



const LoadingScreen = ({ personality, onComplete }: { personality: Personality; onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br ${personality.bgGradient}`}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
    >
      <div className="text-center">
        <motion.div
          className="text-8xl mb-8"
          animate={{ 
            scale: [1, 1.15, 1],
            rotate: [0, 8, -8, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {personality.icon}
        </motion.div>
        
        <motion.h1
          className="text-4xl font-light mb-4"
          style={{ color: personality.textColor }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        >
          Welcome to Your Therapeutic Space
        </motion.h1>
        
        <motion.div
          className="flex items-center justify-center gap-2 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: personality.color }}
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

const WaterFillTransition = ({ isActive, color }: { isActive: boolean; color: string }) => (
  <AnimatePresence>
    {isActive && (
      <motion.div
        className="fixed inset-0 pointer-events-none z-50 will-change-transform flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="rounded-full"
          initial={{ scale: 0, opacity: 0.9 }}
          animate={{ scale: 30, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
          style={{
            background: `radial-gradient(circle, ${color}60 0%, ${color}30 40%, transparent 70%)`,
            width: '100px',
            height: '100px'
          }}
        />
      </motion.div>
    )}
  </AnimatePresence>
)

const PersonalityModal = ({ 
  personalities, 
  activePersonality, 
  isOpen,
  onPersonalityChange,
  onClose
}: {
  personalities: Personality[]
  activePersonality: Personality
  isOpen: boolean
  onPersonalityChange: (personality: Personality) => void
  onClose: () => void
}) => {
  const handlePersonalitySelect = useCallback((personality: Personality) => {
    onPersonalityChange(personality)
    onClose()
  }, [onPersonalityChange, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 backdrop-blur-sm bg-black/15"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <motion.div
            className="relative z-10 w-full max-w-2xl"
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 40 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <motion.h2
                  className="text-3xl font-light"
                  style={{ color: activePersonality.textColor }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  Choose Your Companion
                </motion.h2>
                
                <motion.button
                  onClick={onClose}
                  className="p-3 rounded-2xl backdrop-blur-md border border-white/20 shadow-lg transition-all duration-300"
                  style={{ 
                    backgroundColor: `${activePersonality.color}15`,
                    color: activePersonality.textColor
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Personality Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {personalities.map((personality, index) => (
                  <motion.button
                    key={personality.id}
                    onClick={() => handlePersonalitySelect(personality)}
                    className="group relative p-6 rounded-2xl text-left overflow-hidden transition-all duration-300"
                    style={{ 
                      backgroundColor: personality.id === activePersonality.id 
                        ? `${personality.color}25` 
                        : `${personality.color}10`,
                      border: `1px solid ${personality.color}20`
                    }}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: 0.2 + index * 0.15, 
                      duration: 0.7,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      y: -4,
                      backgroundColor: `${personality.color}20`,
                      borderColor: `${personality.color}30`
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Content */}
                    <div className="relative z-10 flex items-center gap-4">
                      <motion.div 
                        className="text-4xl transition-all duration-300"
                        whileHover={{ scale: 1.15, rotate: 8 }}
                      >
                        {personality.icon}
                      </motion.div>
                      
                      <div className="flex-1">
                        <h3 
                          className="text-xl font-semibold mb-2"
                          style={{ color: personality.textColor }}
                        >
                          {personality.name}
                        </h3>
                        <p 
                          className="text-sm opacity-80 leading-relaxed"
                          style={{ color: personality.textColor }}
                        >
                          {personality.description}
                        </p>
                      </div>
                      
                      {/* Active Indicator */}
                      {personality.id === activePersonality.id && (
                        <motion.div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: personality.color }}
                          initial={{ scale: 0, rotate: 0 }}
                          animate={{ scale: 1, rotate: 360 }}
                          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                        />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
              
              {/* Footer */}
              <motion.p
                className="text-center mt-8 opacity-70"
                style={{ color: activePersonality.textColor }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.7, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                Each personality offers a unique therapeutic approach tailored to your needs
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const PersonalityButton = ({ 
  activePersonality, 
  onClick 
}: {
  activePersonality: Personality
  onClick: () => void
}) => (
  <motion.button
    onClick={onClick}
    className="flex items-center gap-4 px-8 py-4 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl transition-all duration-700 will-change-transform"
    style={{ 
      backgroundColor: `${activePersonality.color}15`,
      borderColor: `${activePersonality.color}25`
    }}
    whileHover={{ 
      y: -5, 
      scale: 1.02,
      boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
    }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
  >
    <motion.span 
      className="text-3xl"
      whileHover={{ scale: 1.2, rotate: 15 }}
      transition={{ duration: 0.4 }}
    >
      {activePersonality.icon}
    </motion.span>
    <div className="flex flex-col items-start">
      <span 
        className="font-semibold text-lg"
        style={{ color: activePersonality.textColor }}
      >
        {activePersonality.name}
      </span>
      <span 
        className="text-sm opacity-70"
        style={{ color: activePersonality.textColor }}
      >
        {activePersonality.description}
      </span>
    </div>
  </motion.button>
)

const VoiceVisualization = ({ isActive, color }: { isActive: boolean; color: string }) => (
  <div className="flex items-center justify-center gap-2">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="w-2 rounded-full will-change-transform"
        style={{ backgroundColor: color }}
        animate={isActive ? {
          height: [8, 28, 16, 32, 12],
          opacity: [0.3, 1, 0.5, 1, 0.4]
        } : { height: 8, opacity: 0.3 }}
        transition={{
          duration: 1.2,
          repeat: isActive ? Infinity : 0,
          delay: i * 0.15,
          ease: "easeInOut"
        }}
      />
    ))}
  </div>
)

const VoiceMode = ({ personality, onExit }: { personality: Personality; onExit: () => void }) => (
  <motion.div
    className="fixed inset-0 z-50 flex items-center justify-center"
    style={{ backgroundColor: `${personality.color}10` }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.8, ease: "easeInOut" }}
  >
    <div className="text-center flex flex-col items-center">
      <motion.div
        className="text-6xl mb-8"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {personality.icon}
      </motion.div>
      
      <motion.h2
        className="text-3xl font-light mb-8"
        style={{ color: personality.textColor }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Listening to you...
      </motion.h2>
      
      <motion.div 
        className="mb-8 flex justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <VoiceVisualization isActive={true} color={personality.color} />
      </motion.div>
      
      <motion.button
        onClick={onExit}
        className="px-8 py-4 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl transition-all duration-500"
        style={{ 
          backgroundColor: `${personality.color}20`,
          color: personality.textColor
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        whileHover={{ scale: 1.08, y: -3 }}
        whileTap={{ scale: 0.95 }}
      >
        <MicOff size={24} />
      </motion.button>
    </div>
  </motion.div>
)

export default function AIAssistant() {
  type AssistantMode = 'chat' | 'agent'
  const [isLoading, setIsLoading] = useState(true)
  const [activePersonality, setActivePersonality] = useState(personalities[0])
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [hasStartedChat, setHasStartedChat] = useState(false)
  const [isPersonalityModalOpen, setIsPersonalityModalOpen] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [assistantMode, setAssistantMode] = useState<AssistantMode>('chat')
  const [proposalDrafts, setProposalDrafts] = useState<Record<string, any>>({})
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)

  const handlePersonalityChange = useCallback((personality: Personality) => {
    if (personality.id === activePersonality.id) return
    
    setIsTransitioning(true)
    setMessages([])
    setConversationHistory([])
    setHasStartedChat(false)
    
    setTimeout(() => {
      setActivePersonality(personality)
      setIsTransitioning(false)
    }, 300)
  }, [activePersonality.id])

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return

    if (!hasStartedChat) {
      setHasStartedChat(true)
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    if (assistantMode === 'chat') {
      // Classic chatbot with personality
      try {
        const aiResponse = await getAIResponse(inputValue, activePersonality, conversationHistory)
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponse,
          isUser: false,
          timestamp: new Date()
        }
        const newHistory: Array<{role: 'user' | 'assistant', content: string}> = [
          ...conversationHistory,
          { role: 'user', content: inputValue },
          { role: 'assistant', content: aiResponse }
        ]
        setConversationHistory(newHistory)
        setMessages(prev => [...prev, aiMessage])
      } catch (error) {
        console.error('AI response error:', error)
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `I'm here to help. How can I assist you today?`,
          isUser: false,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
      }
      return
    }

    // Agent mode: quick auto-consent handler
    // If user types a confirmation (e.g., "I confirm", "yes, place the call"),
    // auto-execute the most recent pending proposal.
    const consentRegex = /(i\s*confirm|yes[,!]?|go\s*ahead|place\s*the\s*call|do\s*it)/i
    if (consentRegex.test(inputValue)) {
      const pending = [...messages].reverse().find(m => m.proposal?.status === 'pending')
      if (pending?.proposal) {
        try {
          const finalArgs = (() => {
            if (pending.proposal!.tool === 'twilio.call') {
              const draft = proposalDrafts[pending.id] || {}
              return {
                ...pending.proposal!.args,
                to: draft.to || pending.proposal!.args?.to || '',
                message: draft.message || pending.proposal!.args?.message || ''
              }
            }
            return pending.proposal!.args
          })()
          const res = await fetch('/api/tools/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool: pending.proposal!.tool, args: finalArgs })
          })
          const data = await res.json().catch(() => ({ ok: false, error: 'Bad JSON from tool' }))
          setMessages(prev => prev.map(m => m.id === pending.id ? {
            ...m,
            proposal: { ...m.proposal!, status: data.ok ? 'accepted' : 'declined' },
            toolResult: data
          } : m))
          try {
            const url = data?.data?.gmaps_url
            if (data?.ok && typeof url === 'string') window.open(url, '_blank')
          } catch {}
          return
        } catch (e) {
          // fall through to normal agent proposal if auto-consent fails
        }
      }
    }

    // Agent mode: tool proposals
    try {
      const agentRes = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [
          ...messages.map(m => ({ role: m.isUser ? 'user' as const : 'assistant' as const, content: m.text })),
          { role: 'user', content: inputValue }
        ] })
      })
      const agentData = await agentRes.json()

      if (agentData?.type === 'propose' && agentData.tool && agentData.args) {
        const toolMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `${activePersonality.name} proposes using ${agentData.tool}`,
          isUser: false,
          timestamp: new Date(),
          proposal: { tool: agentData.tool, args: agentData.args, why: agentData.why, status: 'pending' }
        }
        setMessages(prev => [...prev, toolMessage])
      } else if (agentData?.type === 'final' && agentData.message) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: agentData.message,
          isUser: false,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: typeof agentData === 'string' ? agentData : JSON.stringify(agentData),
          isUser: false,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
      }
    } catch (error) {
      console.error('Agent error:', error)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `I'm here to help. How can I assist you today?`,
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
    }
  }, [inputValue, activePersonality, hasStartedChat, assistantMode, messages, conversationHistory])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (isLoading) {
    return (
      <AnimatePresence>
        <LoadingScreen 
          personality={activePersonality} 
          onComplete={() => setIsLoading(false)} 
        />
      </AnimatePresence>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden transition-all duration-1000 ease-out">
      {/* Background */}
      <motion.div 
        className={`absolute inset-0 bg-gradient-to-br ${activePersonality.bgGradient}`}
        key={activePersonality.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />

      {/* Water Fill Transition */}
      <WaterFillTransition isActive={isTransitioning} color={activePersonality.color} />

      {/* Personality Modal */}
      <PersonalityModal
        personalities={personalities}
        activePersonality={activePersonality}
        isOpen={isPersonalityModalOpen}
        onPersonalityChange={handlePersonalityChange}
        onClose={() => setIsPersonalityModalOpen(false)}
      />

                  {/* Voice Mode Overlay */}
            <AnimatePresence>
              {isVoiceMode && (
                <VoiceMode 
                  personality={activePersonality} 
                  onExit={() => setIsVoiceMode(false)} 
                />
              )}
            </AnimatePresence>

            {/* Voice Modal */}
            <VoiceModal
              isOpen={isVoiceModalOpen}
              personality={activePersonality}
              onClose={() => setIsVoiceModalOpen(false)}
            />

      {/* Main Interface */}
      <AnimatePresence>
        {!isVoiceMode && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Open Voice Modal Button */}
            <div className="fixed top-8 left-8 z-40">
              <motion.button
                onClick={() => setIsVoiceModalOpen(true)}
                className="p-4 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl transition-all duration-500 will-change-transform"
                style={{ 
                  backgroundColor: `${activePersonality.color}15`,
                  color: activePersonality.textColor
                }}
                whileHover={{ scale: 1.08, y: -4, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <Mic size={22} />
              </motion.button>
            </div>

            {/* Mode Toggle + Personality Button */}
            <div className="fixed top-8 left-1/2 z-40" style={{ transform: 'translateX(-50%)' }}>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <PersonalityButton
                  activePersonality={activePersonality}
                  onClick={() => setIsPersonalityModalOpen(true)}
                />
              </motion.div>
              <div className="flex items-center justify-center gap-2 mt-2">
                <button
                  onClick={() => setAssistantMode('chat')}
                  className={`px-3 py-1 rounded-lg text-xs border ${assistantMode==='chat' ? 'opacity-100' : 'opacity-70'}`}
                  style={{ borderColor: `${activePersonality.color}30`, backgroundColor: assistantMode==='chat' ? `${activePersonality.color}15` : 'transparent', color: activePersonality.textColor }}
                >
                  Chat mode
                </button>
                <button
                  onClick={() => setAssistantMode('agent')}
                  className={`px-3 py-1 rounded-lg text-xs border ${assistantMode==='agent' ? 'opacity-100' : 'opacity-70'}`}
                  style={{ borderColor: `${activePersonality.color}30`, backgroundColor: assistantMode==='agent' ? `${activePersonality.color}15` : 'transparent', color: activePersonality.textColor }}
                >
                  Agent mode
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col h-screen pt-32 pb-40">
              {/* Welcome Section */}
              <AnimatePresence>
                {!hasStartedChat && (
                  <motion.div
                    className="flex-1 flex flex-col items-center justify-center px-6"
                    initial={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, y: -40 }}
                    transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <motion.div
                      className="text-9xl mb-8"
                      animate={{ 
                        scale: [1, 1.08, 1],
                        rotate: [0, 3, -3, 0]
                      }}
                      transition={{ 
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {activePersonality.icon}
                    </motion.div>
                    
                    <motion.h1
                      className="text-6xl font-light mb-6 text-center leading-tight"
                      style={{ color: activePersonality.textColor }}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
                    >
                      Hello, I'm {activePersonality.name}
                    </motion.h1>
                    
                    <motion.p
                      className="text-2xl opacity-80 text-center max-w-2xl leading-relaxed"
                      style={{ color: activePersonality.textColor }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 0.8, y: 0 }}
                      transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
                    >
                      {activePersonality.description}. I'm here to provide you with a safe, therapeutic space. How can I help you today?
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Messages */}
              {messages.length > 0 && (
                <div className="flex-1 overflow-y-auto px-6 space-y-6">
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ 
                          duration: 0.8,
                          delay: index * 0.1,
                          ease: [0.4, 0, 0.2, 1]
                        }}
                      >
                        <motion.div
                          className={`max-w-md p-4 rounded-2xl backdrop-blur-sm ${
                            message.isUser 
                              ? 'ml-auto' 
                              : 'mr-auto'
                          }`}
                          style={{
                            backgroundColor: message.isUser 
                              ? `${activePersonality.color}30` 
                              : `${activePersonality.color}15`,
                            color: activePersonality.textColor,
                            border: `1px solid ${activePersonality.color}20`
                          }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* Proposal Card */}
                          {message.proposal && (
                            <div>
                              <div className="text-sm font-semibold mb-1">Proposed: {message.proposal.tool}</div>
                              {message.proposal.why && (
                                <div className="text-xs opacity-70 mb-2">{message.proposal.why}</div>
                              )}
                              {/* Args preview or editable form for certain tools */}
                              {message.proposal.tool === 'twilio.call' ? (
                                <div className="mb-3 space-y-2">
                                  <div className="flex flex-col gap-1">
                                    <label className="text-xs opacity-80">Phone number</label>
                                    <input
                                      type="tel"
                                      placeholder="+15551234567"
                                      className="text-xs px-2 py-1 rounded-lg border border-white/20 bg-transparent"
                                      style={{ color: activePersonality.textColor }}
                                      value={proposalDrafts[message.id]?.to ?? ''}
                                      onChange={(e) => setProposalDrafts(prev => ({
                                        ...prev,
                                        [message.id]: { ...prev[message.id], to: e.target.value }
                                      }))}
                                    />
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <label className="text-xs opacity-80">Message to play</label>
                                    <textarea
                                      rows={3}
                                      placeholder="I have arrived safely. Just letting you know."
                                      className="text-xs px-2 py-1 rounded-lg border border-white/20 bg-transparent"
                                      style={{ color: activePersonality.textColor }}
                                      value={proposalDrafts[message.id]?.message ?? ''}
                                      onChange={(e) => setProposalDrafts(prev => ({
                                        ...prev,
                                        [message.id]: { ...prev[message.id], message: e.target.value }
                                      }))}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <pre className="text-xs p-2 rounded-xl border border-white/20 overflow-x-auto mb-3" style={{ backgroundColor: `${activePersonality.color}08` }}>
{JSON.stringify(message.proposal.args, null, 2)}
                                </pre>
                              )}
                              {message.proposal.status === 'pending' && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={async () => {
                                      try {
                                        // Merge draft inputs for special tools
                                        const finalArgs = (() => {
                                          if (message.proposal?.tool === 'twilio.call') {
                                            const draft = proposalDrafts[message.id] || {}
                                            return {
                                              ...message.proposal.args,
                                              to: (draft.to ?? message.proposal.args?.to ?? '').toString().trim(),
                                              message: (draft.message ?? message.proposal.args?.message ?? '').toString().trim()
                                            }
                                          }
                                          return message.proposal!.args
                                        })()

                                        // Simple client-side validation for call
                                        if (message.proposal?.tool === 'twilio.call') {
                                          if (!finalArgs.to || !finalArgs.message) {
                                            setMessages(prev => prev.map(m => m.id === message.id ? {
                                              ...m,
                                              toolResult: { ok: false, error: 'Please enter a phone number (E.164) and a message.' }
                                            } : m))
                                            return
                                          }
                                        }

                                        const res = await fetch('/api/tools/execute', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ tool: message.proposal!.tool, args: finalArgs })
                                        })
                                        const data = await res.json().catch(() => ({ ok: false, error: 'Bad JSON from tool' }))
                                        setMessages(prev => prev.map(m => m.id === message.id ? {
                                          ...m,
                                          proposal: { ...m.proposal!, status: data.ok ? 'accepted' : 'declined' },
                                          toolResult: data
                                        } : m))
                                        // Clear draft for this proposal to avoid stale values
                                        setProposalDrafts(prev => { const n = { ...prev }; delete n[message.id]; return n })
                                        // Auto-open Google Maps if present
                                        try {
                                          const url = data?.data?.gmaps_url
                                          if (data?.ok && typeof url === 'string') {
                                            window.open(url, '_blank')
                                          }
                                        } catch {}
                                      } catch (e: any) {
                                        setMessages(prev => prev.map(m => m.id === message.id ? {
                                          ...m,
                                          proposal: { ...m.proposal!, status: 'declined' },
                                          toolResult: { ok: false, error: e?.message || 'Tool execution failed' }
                                        } : m))
                                        setProposalDrafts(prev => { const n = { ...prev }; delete n[message.id]; return n })
                                      }
                                    }}
                                    className="px-3 py-1 rounded-lg border border-white/20"
                                    style={{ backgroundColor: `${activePersonality.color}15` }}
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => {
                                      setMessages(prev => prev.map(m => m.id === message.id ? { ...m, proposal: { ...m.proposal!, status: 'declined' } } : m))
                                    }}
                                    className="px-3 py-1 rounded-lg border border-white/20"
                                    style={{ backgroundColor: `${activePersonality.color}08` }}
                                  >
                                    Decline
                                  </button>
                                </div>
                              )}
                              {message.toolResult && message.toolResult.ok && message.toolResult.data && (
                                <div className="mt-3 p-3 rounded-xl border border-white/20" style={{ backgroundColor: `${activePersonality.color}08` }}>
                                  {/* Directions Result Card */}
                                  {message.proposal?.tool === 'maps.safe_route' ? (
                                    <div>
                                      <div className="text-sm font-semibold mb-1">{message.toolResult.data.summary}</div>
                                      <div className="text-xs opacity-80 mb-2">{message.toolResult.data.distance_text} • {message.toolResult.data.duration_text}</div>
                                      {message.toolResult.data.static_map_url && (
                                        <img src={message.toolResult.data.static_map_url} alt="Route preview" className="rounded-lg w-full mb-2" />
                                      )}
                                      {message.toolResult.data.gmaps_url && (
                                        <a href={message.toolResult.data.gmaps_url} target="_blank" rel="noreferrer" className="text-xs underline">
                                          Open in Google Maps
                                        </a>
                                      )}
                                    </div>
                                  ) : (
                                    <pre className="text-xs overflow-x-auto">{JSON.stringify(message.toolResult.data, null, 2)}</pre>
                                  )}
                                </div>
                              )}
                              {message.toolResult && message.toolResult.ok === false && (
                                <div className="mt-3 p-3 rounded-xl border border-white/20" style={{ backgroundColor: `${activePersonality.color}08` }}>
                                  <div className="text-xs" style={{ color: activePersonality.textColor }}>
                                    Tool error: {String(message.toolResult.error || 'Unknown error')}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          {!message.proposal && (
                            <p className="text-base leading-relaxed">{message.text}</p>
                          )}
                        </motion.div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Floating Input - Properly Centered */}
            <div className="fixed bottom-8 left-0 right-0 z-40">
              <div className="flex justify-center px-8">
                <motion.div
                  className="flex items-center gap-6 p-6 rounded-3xl backdrop-blur-md border shadow-2xl transition-all duration-700 w-full max-w-4xl"
                  style={{ 
                    backgroundColor: `${activePersonality.color}08`,
                    borderColor: `${activePersonality.color}20`
                  }}
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  whileHover={{ 
                    y: -3,
                    boxShadow: "0 30px 60px rgba(0,0,0,0.1)"
                  }}
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={`Share your thoughts with ${activePersonality.name}...`}
                    className="flex-1 bg-transparent outline-none border-none text-lg placeholder-opacity-60 py-2 transition-all duration-300 focus:outline-none focus:ring-0 focus:border-transparent"
                    style={{ 
                      color: activePersonality.textColor,
                      boxShadow: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'textfield'
                    }}
                  />
                  
                  <motion.button
                    onClick={handleSendMessage}
                    className="p-4 rounded-2xl transition-all duration-500 shadow-lg will-change-transform"
                    style={{ 
                      backgroundColor: `${activePersonality.color}20`,
                      color: activePersonality.textColor
                    }}
                    whileHover={{ scale: 1.08, y: -2, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!inputValue.trim()}
                  >
                    <Send size={22} />
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
