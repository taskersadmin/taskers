'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface AddTimeModalProps {
  jobId: string
  onAddTime: () => void
  onStop: () => void
}

export function AddTimeModal({ jobId, onAddTime, onStop }: AddTimeModalProps) {
  const [countdown, setCountdown] = useState(180) // 3 minutes
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          onStop()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onStop])

  const handleAddTime = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          jobId, 
          type: 'ADD_TIME',
          priceId: process.env.NEXT_PUBLIC_PRICE_50_ADD30 
        }),
      })
      const { url } = await res.json()
      window.location.href = url
    } catch (error) {
      console.error('Failed to create checkout:', error)
      setLoading(false)
    }
  }

  const minutes = Math.floor(countdown / 60)
  const seconds = countdown % 60

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Time's Up!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-lg">
            Would you like to add 30 more minutes for $50?
          </p>
          
          <div className="text-center text-3xl font-bold text-red-600">
            Auto-ending in {minutes}:{seconds.toString().padStart(2, '0')}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={handleAddTime} 
              disabled={loading}
              className="h-16 text-xl"
            >
              Add 30 Min ($50)
            </Button>
            <Button 
              onClick={onStop} 
              variant="outline"
              className="h-16 text-xl"
            >
              Stop Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
