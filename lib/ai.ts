// AI Service for handling different personality responses
export interface AIResponse {
  text: string
  personality: string
  timestamp: Date
}

export interface Personality {
  id: string
  name: string
  icon: string
  color: string
  bgGradient: string
  textColor: string
  description: string
  systemPrompt: string
}

export const personalities: Personality[] = [
  {
    id: 'lily',
    name: 'Lily',
    icon: '🌸',
    color: '#9333ea',
    bgGradient: 'from-purple-50 via-purple-100 to-purple-200',
    textColor: '#7c3aed',
    description: 'Gentle and nurturing',
    systemPrompt: `You are Lily, a gentle and nurturing AI companion. You provide emotional support, comfort, and gentle guidance. You speak in a warm, caring tone and focus on helping users feel heard and understood. You offer empathy, encouragement, and practical advice in a soothing manner.`
  },
  {
    id: 'sage',
    name: 'Sage',
    icon: '🌿',
    color: '#059669',
    bgGradient: 'from-emerald-50 via-emerald-100 to-emerald-200',
    textColor: '#047857',
    description: 'Wise and calming',
    systemPrompt: `You are Sage, a wise and calming AI companion. You provide thoughtful insights, philosophical perspectives, and deep understanding. You speak with wisdom, patience, and clarity. You help users gain new perspectives, find meaning, and develop mindfulness. Your responses are contemplative and enlightening.`
  },
  {
    id: 'marigold',
    name: 'Marigold',
    icon: '🌻',
    color: '#d97706',
    bgGradient: 'from-amber-50 via-amber-100 to-amber-200',
    textColor: '#b45309',
    description: 'Warm and energetic',
    systemPrompt: `You are Marigold, a warm and energetic AI companion. You bring enthusiasm, positivity, and motivation to conversations. You speak with energy, optimism, and encouragement. You help users build confidence, set goals, and take action. Your responses are uplifting and inspiring.`
  },
  {
    id: 'orchid',
    name: 'Orchid',
    icon: '🌺',
    color: '#dc2626',
    bgGradient: 'from-rose-50 via-rose-100 to-rose-200',
    textColor: '#be185d',
    description: 'Elegant and sophisticated',
    systemPrompt: `You are Orchid, an elegant and sophisticated AI companion. You provide refined insights, cultural knowledge, and intellectual discourse. You speak with grace, sophistication, and depth. You help users explore ideas, appreciate beauty, and develop refined tastes. Your responses are cultured and thoughtful.`
  }
]

// Mock AI responses for development (when no AI service is connected)
const mockResponses = {
  lily: [
    "I understand how you're feeling. It's completely normal to experience these emotions. Would you like to talk more about what's on your mind?",
    "That sounds challenging. I'm here to listen and support you through this. What would be most helpful for you right now?",
    "I can sense this is important to you. Let's explore this together - what feels most pressing to address first?",
    "You're showing such strength in sharing this with me. How can I best support you in this moment?"
  ],
  sage: [
    "This situation offers an opportunity for growth and reflection. What deeper insights might we discover here?",
    "Consider this from a different perspective - what patterns do you notice in how you're approaching this?",
    "Wisdom often comes from embracing uncertainty. What questions does this experience raise for you?",
    "Every challenge contains a lesson. What might this situation be teaching you about yourself?"
  ],
  marigold: [
    "Wow, that's really interesting! I love your enthusiasm about this. What's the most exciting part for you?",
    "You've got this! I can see your determination shining through. What's your next step going to be?",
    "That's such a positive way to look at it! How can we build on this momentum?",
    "I'm excited to see where this takes you! What would make you feel most accomplished right now?"
  ],
  orchid: [
    "How fascinating. This reminds me of the nuanced ways we navigate complex situations. What aspects intrigue you most?",
    "There's a certain elegance in how you're approaching this. What deeper meaning do you find in this experience?",
    "This speaks to the sophisticated nature of human experience. How does this resonate with your values?",
    "I appreciate the thoughtfulness you're bringing to this. What cultural or philosophical perspectives might enrich your understanding?"
  ]
}

// Function to get a random response for a personality
export function getMockResponse(personalityId: string): string {
  const responses = mockResponses[personalityId as keyof typeof mockResponses]
  if (!responses) {
    return "I'm here to help. How can I assist you today?"
  }
  return responses[Math.floor(Math.random() * responses.length)]
}

// Ollama API integration
export async function getOllamaResponse(
  message: string, 
  personality: Personality,
  conversationHistory: Array<{role: 'user' | 'assistant', content: string}>
): Promise<string> {
  console.log('🤖 Ollama Request:', {
    personality: personality.name,
    message: message,
    historyLength: conversationHistory.length
  })
  
  try {
    const base = typeof window === 'undefined'
      ? (process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434')
      : ''
    const url = typeof window === 'undefined' ? `${base}/api/chat` : '/api/ollama/chat'
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama2', // or 'mistral', 'codellama', etc.
        messages: [
          {
            role: 'system',
            content: personality.systemPrompt
          },
          ...conversationHistory,
          {
            role: 'user',
            content: message
          }
        ],
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('🤖 Ollama Response:', {
      personality: personality.name,
      response: data.message.content,
      status: response.status
    })
    return data.message.content
  } catch (error) {
    console.error('❌ Ollama API error:', error)
    console.log('🔄 Falling back to mock response for', personality.name)
    // Fallback to mock response
    return getMockResponse(personality.id)
  }
}

// Hugging Face API integration (free tier)
export async function getHuggingFaceResponse(
  message: string,
  personality: Personality
): Promise<string> {
  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `${personality.systemPrompt}\n\nUser: ${message}\n${personality.name}:`,
          parameters: {
            max_length: 150,
            temperature: 0.7,
            top_p: 0.9
          }
        })
      }
    )

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`)
    }

    const data = await response.json()
    return data[0]?.generated_text || getMockResponse(personality.id)
  } catch (error) {
    console.error('Hugging Face API error:', error)
    return getMockResponse(personality.id)
  }
}

// Main AI service function
export async function getAIResponse(
  message: string,
  personality: Personality,
  conversationHistory: Array<{role: 'user' | 'assistant', content: string}> = [],
  useOllama: boolean = true  // Changed to true to use Ollama by default
): Promise<string> {
  if (useOllama) {
    return getOllamaResponse(message, personality, conversationHistory)
  }
  
  // For now, use mock responses
  // You can switch to Hugging Face or other services by changing this
  return getMockResponse(personality.id)
} 