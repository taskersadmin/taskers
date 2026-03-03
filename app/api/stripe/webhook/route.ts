import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { findEligibleTaskers, createDispatchOffer } from '@/lib/dispatch';

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const jobId = session.metadata?.jobId;

    if (!jobId) {
      return NextResponse.json({ error: 'No job ID' }, { status: 400 });
    }

    await prisma.payment.updateMany({
      where: { stripeCheckoutSessionId: session.id },
      data: { 
        status: 'succeeded',
        stripePaymentIntentId: session.payment_intent,
      },
    });

    const job = await prisma.job.update({
      where: { id: jobId },
      data: { 
        status: 'SEARCHING',
        paidAt: new Date(),
      },
    });

    if (job.lat && job.lng) {
      const taskers = await findEligibleTaskers(job.lat, job.lng);
      
      if (taskers.length > 0) {
        const nearest = taskers[0];
        await createDispatchOffer(jobId, nearest.id, nearest.distance);
        
        await prisma.job.update({
          where: { id: jobId },
          data: { status: 'OFFERED' },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
