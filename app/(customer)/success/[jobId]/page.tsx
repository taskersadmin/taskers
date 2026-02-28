'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

export default function SuccessPage() {
  const { jobId } = useParams()
  const [status, setStatus] = useState('processing')

  useEffect(() => {
    // Connect to SSE
    const eventSource = new EventSource(`/api/stream/jobs/${jobId}`)
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.status === 'ACCEPTED') {
        setStatus('accepted')
        eventSource.close()
      }
    }

    return () => eventSource.close()
  }, [jobId])

  return (
    <div className="max-w-xl mx-auto py-12 text-center space-y-8">
      <div className="flex justify-center">
        <CheckCircle className="h-24 w-24 text-green-500" />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold mb-2">Payment Received!</h2>
        <p className="text-xl text-muted-foreground">Dispatching now...</p>
      </div>

      <Card>
        <CardContent className="p-8">
          {status === 'processing' ? (
            <div className="space-y-4">
              <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <p className="text-lg">Finding the nearest available tasker...</p>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-[shimmer_2s_infinite] w-1/2"></div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xl font-semibold text-green-600">Tasker Found!</p>
              <p>Your tasker is preparing to head your way.</p>
              <Link href={`/job/${jobId}`}>
                <Button className="w-full h-14 text-xl mt-4">
                  View Job Details
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      <Link href="/support">
        <Button variant="outline" className="h-12 text-lg">
          Contact Support
        </Button>
      </Link>
    </div>
  )
}
