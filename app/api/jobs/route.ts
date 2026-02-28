import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generatePin } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, address, description, serviceType, priceId } = body

    // Geocode address (simplified - in production use Google Geocoding)
    const lat = 40.7128 // placeholder
    const lng = -74.0060 // placeholder

    const duration = serviceType === 'MINUTES_30' ? 1800 : 3600

    const job = await prisma.job.create({
      data: {
        customerName: name,
        customerPhone: phone,
        customerAddress: address,
        customerLat: lat,
        customerLng: lng,
        description,
        serviceType,
        durationSecondsPurchased: duration,
        pin: generatePin(),
        status: 'DRAFT',
      },
    })

    return NextResponse.json({ jobId: job.id })
  } catch (error) {
    console.error('Failed to create job:', error)
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')

  if (type === 'offers') {
    // Get current tasker from session (simplified)
    // In production, get from auth session
    const offers = await prisma.dispatchOffer.findMany({
      where: {
        acceptedAt: null,
        declinedAt: null,
        offerExpiresAt: { gt: new Date() },
      },
      include: {
        job: true,
      },
    })

    return NextResponse.json(offers.map(o => ({
      id: o.id,
      jobId: o.jobId,
      area: 'Nearby', // General area only
      duration: o.job.serviceType === 'MINUTES_30' ? '30 min' : '1 hr',
      payout: o.job.serviceType === 'MINUTES_30' ? '$60' : '$100', // Tasker payout (example)
      expiresAt: o.offerExpiresAt,
    })))
  }

  return NextResponse.json([])
}
