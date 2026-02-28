import { prisma } from './prisma'
import { redis } from './redis'
import { calculateDistance } from './utils'
import { DISPATCH_RADIUS_MILES, DISPATCH_OFFER_TTL_SECONDS, MAX_CONCURRENT_JOBS_PER_TASKER } from './constants'
import { publishJobUpdate } from './sse'

export async function startDispatch(jobId: string) {
  // Update job status to SEARCHING
  await prisma.job.update({
    where: { id: jobId },
    data: { status: 'SEARCHING' },
  })

  await publishJobUpdate(jobId, { status: 'SEARCHING', message: 'Looking for available taskers...' })

  // Trigger dispatch tick
  await processDispatch(jobId)
}

export async function processDispatch(jobId: string) {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { offers: true },
  })

  if (!job || job.status === 'CANCELLED' || job.status === 'COMPLETED') return
  if (job.taskerId) return // Already assigned

  // Find eligible taskers
  const taskers = await prisma.taskerProfile.findMany({
    where: {
      verified: true,
      active: true,
      available: true,
    },
  })

  const eligibleTaskers = taskers.filter(tasker => {
    // Check distance if we have location
    if (job.customerLat && job.customerLng && tasker.currentLat && tasker.currentLng) {
      const distance = calculateDistance(
        job.customerLat,
        job.customerLng,
        tasker.currentLat,
        tasker.currentLng
      )
      if (distance > DISPATCH_RADIUS_MILES) return false
    }

    // Check concurrent jobs
    // This is a simplified check; in production, use a more robust query
    return true
  })

  // Sort by distance, then rating, then idle time
  eligibleTaskers.sort((a, b) => {
    // Distance calculation would go here
    if (b.rating !== a.rating) return b.rating - a.rating
    return 0
  })

  // Create offers for top 5 taskers
  const offerExpiry = new Date(Date.now() + DISPATCH_OFFER_TTL_SECONDS * 1000)
  
  for (const tasker of eligibleTaskers.slice(0, 5)) {
    // Check if offer already exists
    const existingOffer = job.offers.find(o => o.taskerId === tasker.id)
    if (!existingOffer) {
      await prisma.dispatchOffer.create({
        data: {
          jobId,
          taskerId: tasker.id,
          offerExpiresAt: offerExpiry,
        },
      })
      
      await publishJobUpdate(tasker.id, { 
        type: 'NEW_OFFER', 
        jobId,
        expiresAt: offerExpiry,
      })
    }
  }

  await publishJobUpdate(jobId, { 
    status: 'SEARCHING', 
    message: `Notified ${eligibleTaskers.length} nearby taskers...` 
  })
}

export async function acceptOffer(jobId: string, taskerId: string) {
  // Use Redis lock to prevent race conditions
  const lockKey = `job_lock:${jobId}`
  const lock = await redis.set(lockKey, '1', 'EX', 10, 'NX')
  
  if (!lock) {
    throw new Error('Job already assigned')
  }

  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { offers: true },
    })

    if (job?.taskerId) {
      throw new Error('Job already assigned')
    }

    const offer = job?.offers.find(o => o.taskerId === taskerId && !o.acceptedAt && !o.declinedAt)
    if (!offer || offer.offerExpiresAt < new Date()) {
      throw new Error('Offer expired or invalid')
    }

    // Update job and offer
    await prisma.$transaction([
      prisma.job.update({
        where: { id: jobId },
        data: { 
          status: 'ACCEPTED',
          taskerId: taskerId,
          acceptedAt: new Date(),
        },
      }),
      prisma.dispatchOffer.update({
        where: { id: offer.id },
        data: { acceptedAt: new Date() },
      }),
      prisma.auditLog.create({
        data: {
          jobId,
          actorRole: 'TASKER',
          toStatus: 'ACCEPTED',
          metadata: { taskerId },
        },
      }),
    ])

    // Decline other offers
    await prisma.dispatchOffer.updateMany({
      where: { 
        jobId, 
        id: { not: offer.id },
        acceptedAt: null,
      },
      data: { declinedAt: new Date() },
    })

    await publishJobUpdate(jobId, { 
      status: 'ACCEPTED',
      message: 'Tasker assigned! Preparing for arrival...',
    })

    return true
  } finally {
    await redis.del(lockKey)
  }
}
