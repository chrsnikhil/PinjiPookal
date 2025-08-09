import { z } from 'zod'

export type ToolExecutionResult = {
  ok: boolean
  data?: unknown
  error?: string
}

export interface ToolDefinition<Schema extends z.ZodTypeAny> {
  name: string
  description: string
  schema: Schema
  execute: (args: z.infer<Schema>) => Promise<ToolExecutionResult>
}

// Example tool: maps.safe_route (stub implementation)
const safeRouteSchema = z.object({
  from: z.string().min(2),
  to: z.string().min(2),
  mode: z.enum(['walking', 'driving', 'transit', 'bicycling']).optional().default('walking'),
  time: z.string().optional(), // ISO or human-readable; currently unused in this basic impl
})

async function geocodeNominatim(query: string): Promise<{ lat: number; lon: number } | null> {
  const params = new URLSearchParams({ q: query, format: 'json', limit: '1', addressdetails: '0' })
  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
    headers: { 'User-Agent': 'PinjiPookal/1.0' },
  })
  if (!res.ok) return null
  const data = await res.json()
  if (!Array.isArray(data) || data.length === 0) return null
  const { lat, lon } = data[0]
  return { lat: parseFloat(lat), lon: parseFloat(lon) }
}

function mapModeToORS(mode?: string): string {
  switch (mode) {
    case 'walking':
      return 'foot-walking'
    case 'bicycling':
      return 'cycling-regular'
    case 'driving':
      return 'driving-car'
    case 'transit':
      return 'foot-walking'
    default:
      return 'foot-walking'
  }
}

async function fetchOpenRouteService(args: z.infer<typeof safeRouteSchema>) {
  const key = process.env.ORS_API_KEY
  if (!key) return { ok: false, error: 'Missing ORS_API_KEY in environment' }

  const from = await geocodeNominatim(args.from)
  const to = await geocodeNominatim(args.to)
  if (!from || !to) return { ok: false, error: 'Failed to geocode origin or destination' }

  const profile = mapModeToORS(args.mode)
  const url = `https://api.openrouteservice.org/v2/directions/${profile}?start=${from.lon},${from.lat}&end=${to.lon},${to.lat}`
  const res = await fetch(url, { headers: { Authorization: key } })
  if (!res.ok) return { ok: false, error: `ORS error ${res.status}` }
  const data = await res.json()
  const route = data?.features?.[0]
  if (!route) return { ok: false, error: 'No routes found (ORS)' }

  const segments = route.properties?.segments?.[0]
  const distance_m = segments?.distance
  const duration_s = segments?.duration
  const distance_text = typeof distance_m === 'number' ? `${(distance_m / 1000).toFixed(1)} km` : undefined
  const duration_text = typeof duration_s === 'number' ? `${Math.round(duration_s / 60)} min` : undefined
  const summary = `${distance_text || ''} ${distance_text && duration_text ? '•' : ''} ${duration_text || ''}`.trim()

  const overview_polyline = undefined // ORS returns GeoJSON by default; decode if needed
  const gmaps_url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(args.from)}&destination=${encodeURIComponent(args.to)}&travelmode=${encodeURIComponent(args.mode || 'walking')}`

  return {
    ok: true,
    data: {
      summary,
      distance_text,
      duration_text,
      start_address: args.from,
      end_address: args.to,
      mode: args.mode || 'walking',
      overview_polyline,
      gmaps_url,
      safety_notes: [
        'Prefers main roads where possible.',
        'Consider staying near open venues at night (pharmacies, 24/7 stores).',
      ],
    }
  }
}

const mapsSafeRoute: ToolDefinition<typeof safeRouteSchema> = {
  name: 'maps.safe_route',
  description: 'Use OpenRouteService to compute a route (walking by default). Returns distance/duration and a Google Maps link.',
  schema: safeRouteSchema,
  async execute(args) {
    try {
      return await fetchOpenRouteService(args)
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Unknown error fetching directions' }
    }
  },
}

// Example tool: twilio.sms (stub)
const smsSchema = z.object({
  to: z.string().min(6),
  body: z.string().min(1),
})

const twilioSms: ToolDefinition<typeof smsSchema> = {
  name: 'twilio.sms',
  description: 'Send a reassurance SMS to a contact (requires confirmation).',
  schema: smsSchema,
  async execute(args) {
    // TODO: Wire Twilio. For now, stub success.
    return { ok: true, data: { queued: true, to: args.to, bodyPreview: args.body.slice(0, 80) } }
  },
}

// Twilio Voice call (stub for now; replace with real Twilio when secrets available)
const callSchema = z.object({
  to: z.string().min(6),
  message: z.string().min(1),
  voice: z.string().optional().default('alice')
})

const twilioCall: ToolDefinition<typeof callSchema> = {
  name: 'twilio.call',
  description: 'Place a reassurance phone call and play a short message (requires confirmation).',
  schema: callSchema,
  async execute(args) {
    const sid = process.env.TWILIO_ACCOUNT_SID
    const token = process.env.TWILIO_AUTH_TOKEN
    const from = process.env.TWILIO_FROM_NUMBER
    if (!sid || !token || !from) {
      return { ok: false, error: 'Missing TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, or TWILIO_FROM_NUMBER' }
    }
    try {
      const twilioMod: any = await import('twilio')
      const twilio = (twilioMod as any).default || twilioMod
      const client = twilio(sid, token)
      const sayText = (args.message || '').toString()
      const safe = sayText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      // Use India English; voice defaults to 'alice' unless specified
      const voice = args.voice || 'alice'
      const twiml = `<Response><Say language="en-IN" voice="${voice}">${safe}</Say></Response>`
      const call = await client.calls.create({ to: args.to, from, twiml })
      return { ok: true, data: { sid: call.sid, to: call.to, status: call.status } }
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Failed to place call' }
    }
  }
}

export const toolRegistry: Record<string, ToolDefinition<any>> = {
  [mapsSafeRoute.name]: mapsSafeRoute,
  [twilioSms.name]: twilioSms,
  [twilioCall.name]: twilioCall,
}

export function validateAndExecute(toolName: string, rawArgs: unknown): Promise<ToolExecutionResult> {
  const tool = toolRegistry[toolName]
  if (!tool) return Promise.resolve({ ok: false, error: `Unknown tool: ${toolName}` })
  const parsed = tool.schema.safeParse(rawArgs)
  if (!parsed.success) return Promise.resolve({ ok: false, error: parsed.error.message })
  return tool.execute(parsed.data)
}


