import { NextRequest, NextResponse } from 'next/server'
import { validateAndExecute } from '@/lib/tools'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tool, args } = body as { tool: string, args: unknown }
    const result = await validateAndExecute(tool, args)
    return NextResponse.json(result)
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'unknown' }, { status: 500 })
  }
}


