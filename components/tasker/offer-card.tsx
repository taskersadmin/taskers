import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

interface OfferCardProps {
  offer: {
    id: string
    jobId: string
    distance?: number
    duration: string
    payout: string
    area: string
    expiresAt: Date
  }
  onAccept: (jobId: string) => void
  onDecline: (jobId: string) => void
}

export function OfferCard({ offer, onAccept, onDecline }: OfferCardProps) {
  const [timeLeft, setTimeLeft] = useState(90)

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.floor((new Date(offer.expiresAt).getTime() - Date.now()) / 1000)
      setTimeLeft(Math.max(0, remaining))
      if (remaining <= 0) clearInterval(interval)
    }, 1000)
    return () => clearInterval(interval)
  }, [offer.expiresAt])

  return (
    <Card className="border-2 border-primary">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>New Job Request</span>
          <span className="text-red-500">{timeLeft}s</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-lg">
          <div>
            <div className="text-muted-foreground">Area</div>
            <div className="font-semibold">{offer.area}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Distance</div>
            <div className="font-semibold">{offer.distance ? `${offer.distance.toFixed(1)} mi` : 'Nearby'}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Duration</div>
            <div className="font-semibold">{offer.duration}</div>
          </div>
          <div>
            <div className="text-muted-foreground">You Earn</div>
            <div className="font-semibold text-green-600">{offer.payout}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => onAccept(offer.jobId)}
            className="h-14 text-xl"
          >
            Accept
          </Button>
          <Button 
            onClick={() => onDecline(offer.jobId)}
            variant="outline"
            className="h-14 text-xl"
          >
            Decline
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
