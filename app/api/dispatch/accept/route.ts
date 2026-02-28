import { NextRequest, NextResponse } from 'next/server'
import { acceptOffer } from '@/lib/dispatch'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { jobId } = body

    // Get tasker ID from session (simplified)
    const taskerId = 'tasker_id_from_session'

    await acceptOffer(jobId, taskerId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
