import { NextRequest, NextResponse } from 'next/server'
import { stripe, PRICE_IDS, PRICE_MAP } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { jobId, type = 'INITIAL', priceId } = body

    const job = await prisma.job.findUnique({ where: { id: jobId } })
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    const price = priceId || (job.serviceType === 'MINUTES_30' ? PRICE_IDS.MINUTES_30 : PRICE_IDS.MINUTES_60)
    const priceData = PRICE_MAP[price]

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: price,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.APP_BASE_URL}/success/${jobId}`,
      cancel_url: `${process.env.APP_BASE_URL}/review/${jobId}`,
      metadata: {
        jobId,
        type,
      },
    })

    // Create payment record
    await prisma.payment.create({
      data: {
        jobId,
        stripeSessionId: session.id,
        amount: priceData.amount,
        status: 'pending',
        type: type.toLowerCase(),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
  }
}
