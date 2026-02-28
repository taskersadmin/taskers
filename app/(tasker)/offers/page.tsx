'use client'

import { useEffect, useState } from 'react'
import { OfferCard } from '@/components/tasker/offer-card'
import { useRouter } from 'next/navigation'

export default function OffersPage() {
  const router = useRouter()
  const [offers, setOffers] = useState<any[]>([])

  useEffect(() => {
    const fetchOffers = () => {
      fetch('/api/jobs?type=offers')
        .then(res => res.json())
        .then(data => setOffers(data))
    }

    fetchOffers()
    const interval = setInterval(fetchOffers, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleAccept = async (jobId: string) => {
    await fetch('/api/dispatch/accept', {
      method: 'POST',
      body: JSON.stringify({ jobId }),
    })
    router.push(`/tasker/active-job/${jobId}`)
  }

  const handleDecline = async (jobId: string) => {
    await fetch('/api/dispatch/decline', {
      method: 'POST',
      body: JSON.stringify({ jobId }),
    })
    setOffers(offers.filter(o => o.id !== jobId))
  }

  return (
    <div className="space-y-4 py-4">
      <h2 className="text-2xl font-bold">Available Jobs</h2>
      
      {offers.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No active offers at the moment. Stay tuned!
        </div>
      ) : (
        offers.map(offer => (
          <OfferCard
            key={offer.id}
            offer={offer}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        ))
      )}
    </div>
  )
}
