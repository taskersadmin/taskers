import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { startDispatch } from '@/lib/dispatch'

export async function POST(req: NextRequest) {
  const payload = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const { jobId, type } = session.metadata

    await prisma.$transaction([
      prisma.payment.updateMany({
        where: { stripeSessionId: session.id },
        data: { 
          status: 'succeeded',
          stripePaymentIntentId: session.payment_intent,
        },
      }),
      prisma.job.update({
        where: { id: jobId },
        data: { 
          status: 'PAID',
          paidAt: new Date(),
        },
      }),
    ])

    // Start dispatch only after payment confirmed
    if (type === 'INITIAL') {
      await startDispatch(jobId)
    } else if (type === 'ADD_TIME') {
      // Handle add time logic
      const job = await prisma.job.findUnique({ where: { id: jobId } })
      await prisma.job.update({
        where: { id: jobId },
        data: {
          durationSecondsPurchased: job!.durationSecondsPurchased + 1800,
          status: 'IN_PROGRESS',
        },
      })
    }
  }

  return NextResponse.json({ received: true })
}
