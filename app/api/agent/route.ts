import { NextRequest, NextResponse } from 'next/server'
import { validateAndExecute, toolRegistry } from '@/lib/tools'

const SYSTEM = `You are a helpful safety companion for women. You may propose using a tool, but you NEVER execute it yourself.
Your response MUST be valid JSON with no extra text, no markdown, no explanations.
You have two output modes:
1) {"type":"final","message":"<concise helpful text>"}
2) {"type":"propose","tool":"<tool_name>","args":{...},"why":"<short reason>"}
Rules:
- Only propose tools from the provided list.
- For sensitive tools (SMS/calls), always propose first; never assume consent.
- Keep JSON strictly valid. No trailing commas. No additional keys.`

const FEWSHOT = [
  { role: 'user' as const, content: 'Find me a safer way from MG Road to Indiranagar.' },
  { role: 'assistant' as const, content: JSON.stringify({ type: 'propose', tool: 'maps.safe_route', args: { from: 'MG Road', to: 'Indiranagar' }, why: 'Safer route proposal using main roads and open venues.' }) },
  { role: 'user' as const, content: 'Thanks, just reassure me without any tools.' },
  { role: 'assistant' as const, content: JSON.stringify({ type: 'final', message: 'I’m here with you. Take a deep breath; you’re doing great. I can also propose a safer route if you want.' }) },
  { role: 'user' as const, content: 'Call +91 7305025707 and say I have arrived safely.' },
  { role: 'assistant' as const, content: JSON.stringify({ type: 'propose', tool: 'twilio.call', args: { to: '+917305025707', message: 'I have arrived safely.' }, why: 'Place a reassurance phone call with a short message.' }) },
]

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages, persona } = body as { messages: { role: 'user'|'assistant'|'system', content: string }[], persona?: string }

    const toolsList = Object.values(toolRegistry).map(t => ({ name: t.name, description: t.description }))
    const toolContext = `Tools: ${JSON.stringify(toolsList)}`

    const promptMessages = [
      { role: 'system', content: SYSTEM },
      { role: 'system', content: toolContext },
      ...FEWSHOT,
      ...(messages || []),
    ]

    // Call Ollama directly (server-side absolute URL)
    const base = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434'
    const res = await fetch(`${base}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'llama2', messages: promptMessages, stream: false, options: { temperature: 0 } })
    })
    if (!res.ok) return NextResponse.json({ error: 'LLM error', status: res.status }, { status: 500 })
    const data = await res.json()
    let content: string = data?.message?.content || ''

    // Try parse JSON (fallback: extract first JSON object)
    let parsed: any
    try {
      parsed = JSON.parse(content)
    } catch {
      const start = content.indexOf('{')
      const end = content.lastIndexOf('}')
      if (start >= 0 && end > start) {
        const candidate = content.slice(start, end + 1)
        try { parsed = JSON.parse(candidate) } catch { /* ignore */ }
      }
      if (!parsed) return NextResponse.json({ type: 'final', message: content })
    }

    if (parsed?.type === 'propose' && parsed?.tool && parsed?.args) {
      // Do not execute yet; return proposal to client for confirmation
      return NextResponse.json({ type: 'propose', tool: parsed.tool, args: parsed.args, why: parsed.why || '' })
    }

    if (parsed?.type === 'final') {
      return NextResponse.json(parsed)
    }

    // Fallback: return plain content
    return NextResponse.json({ type: 'final', message: content })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}


