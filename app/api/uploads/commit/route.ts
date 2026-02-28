import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { jobId, type, path, lat, lng, deviceInfo } = body

    // Get public URL
    const { data: { publicUrl } } = await supabase
      .storage
      .from(process.env.SUPABASE_STORAGE_BUCKET!)
      .getPublicUrl(path)

    // Create photo record
    await prisma.photoEvidence.create({
      data: {
        jobId,
        type,
        url: publicUrl,
        takenAt: new Date(),
        lat,
        lng,
        deviceInfo,
        fileHash: 'hash_placeholder', // Calculate actual hash in production
        fileSize: 0,
        mimeType: 'image/jpeg',
      },
    })

    // Update job status
    const newStatus = type === 'BEFORE' ? 'BEFORE_PHOTO' : 'AFTER_PHOTO'
    await prisma.job.update({
      where: { id: jobId },
      data: { status: newStatus },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to commit upload' }, { status: 500 })
  }
}
