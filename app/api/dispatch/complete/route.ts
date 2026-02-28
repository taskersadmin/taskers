import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { jobId } = body

    await prisma.$transaction([
      prisma.job.update({
        where: { id: jobId },
        data: { 
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      }),
      prisma.taskerProfile.update({
        where: { id: 'tasker_id' }, // Get from session
        data: {
          completedJobsCount: { increment: 1 },
          available: true,
        },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to complete task' }, { status: 500 })
  }
}
