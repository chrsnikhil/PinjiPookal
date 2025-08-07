'use client'

import { motion } from 'framer-motion'
import { Mic, Send, X, Heart, Star, Settings } from 'lucide-react'

const personalities = [
  {
    name: 'Lily',
    icon: '🌸',
    color: '#9333ea',
    bgGradient: 'from-purple-50 via-purple-100 to-purple-200',
    textColor: '#7c3aed',
    description: 'Gentle and nurturing'
  },
  {
    name: 'Sage',
    icon: '🌿',
    color: '#059669',
    bgGradient: 'from-emerald-50 via-emerald-100 to-emerald-200',
    textColor: '#047857',
    description: 'Wise and calming'
  },
  {
    name: 'Marigold',
    icon: '🌻',
    color: '#d97706',
    bgGradient: 'from-amber-50 via-amber-100 to-amber-200',
    textColor: '#b45309',
    description: 'Warm and energetic'
  },
  {
    name: 'Orchid',
    icon: '🌺',
    color: '#dc2626',
    bgGradient: 'from-rose-50 via-rose-100 to-rose-200',
    textColor: '#be185d',
    description: 'Elegant and sophisticated'
  }
]

export default function StyleGuide() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-light mb-4 text-gray-800">AI Assistant Design System</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            A comprehensive guide to creating consistent, therapeutic UI components with personality-based theming.
          </p>
        </div>

        {/* Color System */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-gray-700">Color System</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-6 text-gray-700">Personality Colors</h3>
              <div className="space-y-6">
                {personalities.map((personality) => (
                  <div key={personality.name} className="flex items-center gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{personality.icon}</span>
                      <div>
                        <h4 className="font-semibold" style={{ color: personality.textColor }}>
                          {personality.name}
                        </h4>
                        <p className="text-sm text-gray-500">{personality.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: personality.color }}
                        title={`Primary: ${personality.color}`}
                      />
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: personality.textColor }}
                        title={`Text: ${personality.textColor}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-6 text-gray-700">Color Usage Formula</h3>
              <div className="space-y-4 font-mono text-sm">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-gray-600 mb-2">Background Colors:</div>
                  <div className="text-purple-600">{`backgroundColor: \`\${personality.color}08\``}</div>
                  <div className="text-purple-600">{`backgroundColor: \`\${personality.color}15\``}</div>
                  <div className="text-purple-600">{`backgroundColor: \`\${personality.color}20\``}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-gray-600 mb-2">Border Colors:</div>
                  <div className="text-purple-600">{`borderColor: \`\${personality.color}20\``}</div>
                  <div className="text-purple-600">{`borderColor: \`\${personality.color}25\``}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-gray-600 mb-2">Text Colors:</div>
                  <div className="text-purple-600">{`color: personality.textColor`}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h3 className="text-xl font-semibold mb-6 text-gray-700">Background Gradients</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {personalities.map((personality) => (
                <div key={personality.name} className="text-center">
                  <div 
                    className={`h-24 rounded-2xl bg-gradient-to-br ${personality.bgGradient} mb-3`}
                  />
                  <p className="text-sm font-medium" style={{ color: personality.textColor }}>
                    {personality.name}
                  </p>
                  <p className="text-xs text-gray-500 font-mono mt-1">
                    {personality.bgGradient}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-gray-700">Typography</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-6 text-gray-700">Type Scale</h3>
              <div className="space-y-6">
                <div>
                  <h1 className="text-6xl font-light text-purple-600 mb-2">Hello, I'm Lily</h1>
                  <code className="text-sm text-gray-500">text-6xl font-light</code>
                  <p className="text-sm text-gray-600 mt-1">Main welcome heading</p>
                </div>
                
                <div>
                  <h2 className="text-3xl font-light text-purple-600 mb-2">Choose Your Companion</h2>
                  <code className="text-sm text-gray-500">text-3xl font-light</code>
                  <p className="text-sm text-gray-600 mt-1">Modal and section headings</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-purple-600 mb-2">Gentle and nurturing</h3>
                  <code className="text-sm text-gray-500">text-xl font-semibold</code>
                  <p className="text-sm text-gray-600 mt-1">Component titles</p>
                </div>
                
                <div>
                  <p className="text-lg text-purple-600 mb-2">Share your thoughts with me...</p>
                  <code className="text-sm text-gray-500">text-lg</code>
                  <p className="text-sm text-gray-600 mt-1">Input placeholders and body text</p>
                </div>
                
                <div>
                  <p className="text-base text-purple-600 mb-2">This is a chat message</p>
                  <code className="text-sm text-gray-500">text-base</code>
                  <p className="text-sm text-gray-600 mt-1">Chat messages and descriptions</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-6 text-gray-700">Font Weights & Usage</h3>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-xl">
                  <p className="font-light text-2xl text-gray-800 mb-2">font-light</p>
                  <p className="text-sm text-gray-600">Used for: Main headings, welcome text, modal titles</p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-xl">
                  <p className="font-normal text-2xl text-gray-800 mb-2">font-normal</p>
                  <p className="text-sm text-gray-600">Used for: Body text, descriptions, chat messages</p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-xl">
                  <p className="font-semibold text-2xl text-gray-800 mb-2">font-semibold</p>
                  <p className="text-sm text-gray-600">Used for: Button text, personality names, labels</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Component Library */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-gray-700">Component Library</h2>
          
          {/* Buttons */}
          <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
            <h3 className="text-xl font-semibold mb-6 text-gray-700">Buttons</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-medium mb-4 text-gray-600">Primary Buttons</h4>
                <div className="space-y-4">
                  {personalities.slice(0, 2).map((personality) => (
                    <div key={personality.name} className="space-y-2">
                      <motion.button
                        className="px-8 py-4 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl transition-all duration-500"
                        style={{ 
                          backgroundColor: `${personality.color}15`,
                          borderColor: `${personality.color}25`,
                          color: personality.textColor
                        }}
                        whileHover={{ y: -3, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {personality.name} Button
                      </motion.button>
                      <code className="text-xs text-gray-500 block">
                        {`backgroundColor: \`\${personality.color}15\`, borderColor: \`\${personality.color}25\``}
                      </code>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-4 text-gray-600">Icon Buttons</h4>
                <div className="space-y-4">
                  {personalities.slice(0, 2).map((personality) => (
                    <div key={personality.name} className="space-y-2">
                      <div className="flex gap-3">
                        <motion.button
                          className="p-4 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl transition-all duration-500"
                          style={{ 
                            backgroundColor: `${personality.color}15`,
                            color: personality.textColor
                          }}
                          whileHover={{ scale: 1.08, y: -2, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Mic size={22} />
                        </motion.button>
                        
                        <motion.button
                          className="p-4 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl transition-all duration-500"
                          style={{ 
                            backgroundColor: `${personality.color}20`,
                            color: personality.textColor
                          }}
                          whileHover={{ scale: 1.08, y: -2, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Send size={22} />
                        </motion.button>
                      </div>
                      <code className="text-xs text-gray-500 block">
                        whileHover: scale: 1.08, y: -2, rotate: 5
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
              <h4 className="text-lg font-medium mb-4 text-gray-600">Button Code Template</h4>
              <pre className="text-sm text-gray-700 overflow-x-auto">
{`<motion.button
  className="px-8 py-4 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl transition-all duration-500"
  style={{ 
    backgroundColor: \`\${personality.color}15\`,
    borderColor: \`\${personality.color}25\`,
    color: personality.textColor
  }}
  whileHover={{ y: -3, scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
  Button Text
</motion.button>`}
              </pre>
            </div>
          </div>

          {/* Input Fields */}
          <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
            <h3 className="text-xl font-semibold mb-6 text-gray-700">Input Fields</h3>
            
            <div className="space-y-6">
              {personalities.slice(0, 2).map((personality) => (
                <div key={personality.name} className="space-y-3">
                  <div 
                    className="flex items-center gap-6 p-6 rounded-3xl backdrop-blur-md border shadow-2xl transition-all duration-700"
                    style={{ 
                      backgroundColor: `${personality.color}08`,
                      borderColor: `${personality.color}20`
                    }}
                  >
                    <input
                      type="text"
                      placeholder={`Share your thoughts with ${personality.name}...`}
                      className="flex-1 bg-transparent outline-none border-none text-lg placeholder-opacity-60 py-2"
                      style={{ 
                        color: personality.textColor,
                        boxShadow: 'none'
                      }}
                    />
                    <button
                      className="p-4 rounded-2xl shadow-lg"
                      style={{ 
                        backgroundColor: `${personality.color}20`,
                        color: personality.textColor
                      }}
                    >
                      <Send size={22} />
                    </button>
                  </div>
                  <code className="text-xs text-gray-500">
                    {`backgroundColor: \`\${personality.color}08\`, borderColor: \`\${personality.color}20\``}
                  </code>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
              <h4 className="text-lg font-medium mb-4 text-gray-600">Input Field Code Template</h4>
              <pre className="text-sm text-gray-700 overflow-x-auto">
{`<div 
  className="flex items-center gap-6 p-6 rounded-3xl backdrop-blur-md border shadow-2xl"
  style={{ 
    backgroundColor: \`\${personality.color}08\`,
    borderColor: \`\${personality.color}20\`
  }}
>
  <input
    className="flex-1 bg-transparent outline-none text-lg"
    style={{ 
      color: personality.textColor,
      boxShadow: 'none'
    }}
  />
</div>`}
              </pre>
            </div>
          </div>

          {/* Cards & Containers */}
          <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
            <h3 className="text-xl font-semibold mb-6 text-gray-700">Cards & Containers</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {personalities.map((personality) => (
                <motion.div
                  key={personality.name}
                  className="p-6 rounded-2xl transition-all duration-300"
                  style={{ 
                    backgroundColor: `${personality.color}10`,
                    border: `1px solid ${personality.color}20`
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    y: -4,
                    backgroundColor: `${personality.color}20`,
                    borderColor: `${personality.color}30`
                  }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-3xl">{personality.icon}</span>
                    <div>
                      <h4 className="text-lg font-semibold" style={{ color: personality.textColor }}>
                        {personality.name}
                      </h4>
                      <p className="text-sm opacity-80" style={{ color: personality.textColor }}>
                        {personality.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
              <h4 className="text-lg font-medium mb-4 text-gray-600">Card Code Template</h4>
              <pre className="text-sm text-gray-700 overflow-x-auto">
{`<motion.div
  className="p-6 rounded-2xl transition-all duration-300"
  style={{ 
    backgroundColor: \`\${personality.color}10\`,
    border: \`1px solid \${personality.color}20\`
  }}
  whileHover={{ 
    scale: 1.02,
    y: -4,
    backgroundColor: \`\${personality.color}20\`,
    borderColor: \`\${personality.color}30\`
  }}
>
  Content
</motion.div>`}
              </pre>
            </div>
          </div>

          {/* Message Bubbles */}
          <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
            <h3 className="text-xl font-semibold mb-6 text-gray-700">Message Bubbles</h3>
            
            <div className="space-y-6">
              {personalities.slice(0, 2).map((personality) => (
                <div key={personality.name} className="space-y-4">
                  <h4 className="text-lg font-medium" style={{ color: personality.textColor }}>
                    {personality.name} Messages
                  </h4>
                  
                  <div className="space-y-4">
                    {/* User Message */}
                    <div className="flex justify-end">
                      <motion.div
                        className="max-w-md p-4 rounded-2xl backdrop-blur-sm"
                        style={{
                          backgroundColor: `${personality.color}30`,
                          color: personality.textColor,
                          border: `1px solid ${personality.color}20`
                        }}
                        whileHover={{ scale: 1.02, y: -2 }}
                      >
                        <p className="text-base leading-relaxed">This is a user message</p>
                      </motion.div>
                    </div>
                    
                    {/* AI Message */}
                    <div className="flex justify-start">
                      <motion.div
                        className="max-w-md p-4 rounded-2xl backdrop-blur-sm"
                        style={{
                          backgroundColor: `${personality.color}15`,
                          color: personality.textColor,
                          border: `1px solid ${personality.color}20`
                        }}
                        whileHover={{ scale: 1.02, y: -2 }}
                      >
                        <p className="text-base leading-relaxed">This is an AI response from {personality.name}</p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
              <h4 className="text-lg font-medium mb-4 text-gray-600">Message Bubble Code Template</h4>
              <pre className="text-sm text-gray-700 overflow-x-auto">
{`{/* User Message */}
<motion.div
  className="max-w-md p-4 rounded-2xl backdrop-blur-sm"
  style={{
    backgroundColor: \`\${personality.color}30\`,
    color: personality.textColor,
    border: \`1px solid \${personality.color}20\`
  }}
  whileHover={{ scale: 1.02, y: -2 }}
>
  <p className="text-base leading-relaxed">{message.text}</p>
</motion.div>

{/* AI Message */}
<motion.div
  className="max-w-md p-4 rounded-2xl backdrop-blur-sm"
  style={{
    backgroundColor: \`\${personality.color}15\`,
    color: personality.textColor,
    border: \`1px solid \${personality.color}20\`
  }}
  whileHover={{ scale: 1.02, y: -2 }}
>
  <p className="text-base leading-relaxed">{message.text}</p>
</motion.div>`}
              </pre>
            </div>
          </div>
        </section>

        {/* Animation Guidelines */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-gray-700">Animation Guidelines</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-6 text-gray-700">Timing & Easing</h3>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-xl">
                  <h4 className="font-semibold text-gray-700 mb-2">Quick Interactions</h4>
                  <p className="text-sm text-gray-600 mb-2">Button hovers, small scale changes</p>
                  <code className="text-xs text-purple-600">duration: 0.3s, ease: "easeOut"</code>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-xl">
                  <h4 className="font-semibold text-gray-700 mb-2">Standard Transitions</h4>
                  <p className="text-sm text-gray-600 mb-2">Modal open/close, page transitions</p>
                  <code className="text-xs text-purple-600">duration: 0.6-0.8s, ease: [0.4, 0, 0.2, 1]</code>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-xl">
                  <h4 className="font-semibold text-gray-700 mb-2">Theme Changes</h4>
                  <p className="text-sm text-gray-600 mb-2">Personality switching, color transitions</p>
                  <code className="text-xs text-purple-600">duration: 1.2-1.8s, ease: "easeInOut"</code>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-xl">
                  <h4 className="font-semibold text-gray-700 mb-2">Loading Animations</h4>
                  <p className="text-sm text-gray-600 mb-2">Intro screens, continuous animations</p>
                  <code className="text-xs text-purple-600">duration: 2-4s, repeat: Infinity</code>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-6 text-gray-700">Common Animation Patterns</h3>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-xl">
                  <h4 className="font-semibold text-gray-700 mb-2">Button Hover</h4>
                  <code className="text-xs text-purple-600 block">
                    whileHover={`{{ scale: 1.02, y: -3 }}`}
                  </code>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-xl">
                  <h4 className="font-semibold text-gray-700 mb-2">Icon Button Hover</h4>
                  <code className="text-xs text-purple-600 block">
                    whileHover={`{{ scale: 1.08, y: -2, rotate: 5 }}`}
                  </code>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-xl">
                  <h4 className="font-semibold text-gray-700 mb-2">Card Hover</h4>
                  <code className="text-xs text-purple-600 block">
                    whileHover={`{{ scale: 1.02, y: -4 }}`}
                  </code>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-xl">
                  <h4 className="font-semibold text-gray-700 mb-2">Entrance Animation</h4>
                  <code className="text-xs text-purple-600 block">
                    initial={`{{ opacity: 0, y: 30 }}`}<br/>
                    animate={`{{ opacity: 1, y: 0 }}`}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Layout Guidelines */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-gray-700">Layout & Spacing</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-6 text-gray-700">Spacing Scale</h3>
              <div className="space-y-4">
                {[
                  { size: 2, px: 8, use: 'Small gaps, icon spacing' },
                  { size: 4, px: 16, use: 'Button padding, small margins' },
                  { size: 6, px: 24, use: 'Card padding, medium gaps' },
                  { size: 8, px: 32, use: 'Section spacing, large margins' },
                  { size: 12, px: 48, use: 'Component separation' },
                  { size: 16, px: 64, use: 'Major section spacing' },
                  { size: 20, px: 80, use: 'Page margins' },
                  { size: 24, px: 96, use: 'Large page sections' }
                ].map(({ size, px, use }) => (
                  <div key={size} className="flex items-center gap-4">
                    <div 
                      className="bg-purple-200 rounded"
                      style={{ width: `${px}px`, height: '20px' }}
                    />
                    <div className="flex-1">
                      <code className="text-sm font-semibold text-purple-600">
                        {size} ({px}px)
                      </code>
                      <p className="text-sm text-gray-600">{use}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-6 text-gray-700">Border Radius Scale</h3>
              <div className="space-y-4">
                {[
                  { class: 'rounded-xl', px: 12, use: 'Small cards, inputs' },
                  { class: 'rounded-2xl', px: 16, use: 'Buttons, message bubbles' },
                  { class: 'rounded-3xl', px: 24, use: 'Large cards, modals, main containers' }
                ].map(({ class: className, px, use }) => (
                  <div key={className} className="flex items-center gap-4">
                    <div 
                      className={`bg-purple-200 w-16 h-12 ${className}`}
                    />
                    <div className="flex-1">
                      <code className="text-sm font-semibold text-purple-600">
                        {className} ({px}px)
                      </code>
                      <p className="text-sm text-gray-600">{use}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Guide */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-gray-700">Implementation Guide</h2>
          
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h3 className="text-xl font-semibold mb-6 text-gray-700">Step-by-Step Component Creation</h3>
            
            <div className="space-y-8">
              <div className="p-6 border border-gray-200 rounded-2xl">
                <h4 className="text-lg font-semibold mb-4 text-gray-700">1. Define Your Personality Context</h4>
                <pre className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl overflow-x-auto">
{`const personality = {
  id: 'lily',
  name: 'Lily',
  icon: '🌸',
  color: '#9333ea',
  textColor: '#7c3aed',
  description: 'Gentle and nurturing'
}`}
                </pre>
              </div>

              <div className="p-6 border border-gray-200 rounded-2xl">
                <h4 className="text-lg font-semibold mb-4 text-gray-700">2. Apply Base Styling</h4>
                <pre className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl overflow-x-auto">
{`className="p-6 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl"
style={{ 
  backgroundColor: \`\${personality.color}15\`,
  borderColor: \`\${personality.color}25\`,
  color: personality.textColor
}}`}
                </pre>
              </div>

              <div className="p-6 border border-gray-200 rounded-2xl">
                <h4 className="text-lg font-semibold mb-4 text-gray-700">3. Add Motion</h4>
                <pre className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl overflow-x-auto">
{`<motion.div
  whileHover={{ scale: 1.02, y: -4 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  Your content
</motion.div>`}
                </pre>
              </div>

              <div className="p-6 border border-gray-200 rounded-2xl">
                <h4 className="text-lg font-semibold mb-4 text-gray-700">4. Add Entrance Animation</h4>
                <pre className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl overflow-x-auto">
{`initial={{ opacity: 0, y: 30, scale: 0.9 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
transition={{ 
  delay: index * 0.1, 
  duration: 0.7,
  ease: [0.4, 0, 0.2, 1]
}}`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-gray-700">Best Practices</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-6 text-green-600">✅ Do</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">•</span>
                  Use consistent opacity levels (08, 15, 20, 25, 30)
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">•</span>
                  Apply backdrop-blur-md for glass morphism effect
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">•</span>
                  Use personality.textColor for all text elements
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">•</span>
                  Add subtle hover animations (scale: 1.02, y: -2 to -4)
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">•</span>
                  Use rounded-2xl or rounded-3xl for modern look
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">•</span>
                  Include will-change-transform for animated elements
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-6 text-red-600">❌ Don't</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  Use hard-coded colors instead of personality colors
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  Create overly complex hover animations
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  Use different border radius values inconsistently
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  Forget to add transition durations
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  Use sharp corners (rounded-sm, rounded-md)
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  Apply will-change to non-animated elements
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Quick Reference */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-gray-700">Quick Reference</h2>
          
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <h4 className="font-semibold text-gray-700 mb-3">Background Opacity</h4>
                <div className="space-y-1 text-sm">
                  <div><code>08</code> - Very subtle</div>
                  <div><code>15</code> - Light background</div>
                  <div><code>20</code> - Medium background</div>
                  <div><code>25</code> - Border color</div>
                  <div><code>30</code> - Strong background</div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl">
                <h4 className="font-semibold text-gray-700 mb-3">Animation Durations</h4>
                <div className="space-y-1 text-sm">
                  <div><code>0.3s</code> - Quick hover</div>
                  <div><code>0.6s</code> - Standard transition</div>
                  <div><code>0.8s</code> - Entrance animation</div>
                  <div><code>1.2s</code> - Theme change</div>
                  <div><code>1.8s</code> - Water fill effect</div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl">
                <h4 className="font-semibold text-gray-700 mb-3">Common Hover Effects</h4>
                <div className="space-y-1 text-sm">
                  <div><code>scale: 1.02</code> - Subtle grow</div>
                  <div><code>y: -3</code> - Lift effect</div>
                  <div><code>rotate: 5</code> - Playful tilt</div>
                  <div><code>scale: 1.08</code> - Icon emphasis</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
