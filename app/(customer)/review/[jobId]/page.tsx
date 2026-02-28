'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ReviewPage() {
  const { jobId } = useParams()
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/jobs/${jobId}`)
      .then(res => res.json())
      .then(data => setJob(data))
  }, [jobId])

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      })
      const { url } = await res.json()
      window.location.href = url
    } catch (error) {
      console.error('Checkout failed:', error)
      setLoading(false)
    }
  }

  if (!job) return <div>Loading...</div>

  return (
    <div className="max-w-xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Review Your Request</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Service</span>
              <span className="font-semibold">
                {job.serviceType === 'MINUTES_30' ? '30 Minutes' : '1 Hour'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Name</span>
              <span className="font-semibold">{job.customerName}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Phone</span>
              <span className="font-semibold">{job.customerPhone}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Address</span>
              <span className="font-semibold text-right">{job.customerAddress}</span>
            </div>
            <div className="py-2 border-b">
              <span className="text-muted-foreground block mb-1">Description</span>
              <span className="font-semibold">{job.description || 'No description provided'}</span>
            </div>
            <div className="flex justify-between py-4 text-2xl font-bold">
              <span>Total</span>
              <span>${(job.payments?.[0]?.amount / 100) || '75-125'}</span>
            </div>
          </div>

          <Button 
            onClick={handleCheckout} 
            className="w-full h-16 text-xl"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
