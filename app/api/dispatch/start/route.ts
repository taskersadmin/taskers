import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { jobId } = body

    await prisma.job.update({
      where: { id: jobId },
      data: { 
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to start task' }, { status: 500 })
  }
}
