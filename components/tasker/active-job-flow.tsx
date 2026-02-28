'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PhotoUploader } from '@/components/shared/photo-uploader'
import { TimerDisplay } from '@/components/shared/timer-display'
import { MapPin, Navigation, Play, CheckCircle } from 'lucide-react'

interface ActiveJobFlowProps {
  job: any
}

export function ActiveJobFlow({ job }: ActiveJobFlowProps) {
  const [loading, setLoading] = useState(false)

  const handleArrive = async () => {
    setLoading(true)
    await fetch(`/api/dispatch/arrived`, {
      method: 'POST',
      body: JSON.stringify({ jobId: job.id }),
    })
    window.location.reload()
  }

  const handleStart = async () => {
    setLoading(true)
    await fetch(`/api/dispatch/start`, {
      method: 'POST',
      body: JSON.stringify({ jobId: job.id }),
    })
    window.location.reload()
  }

  const handleComplete = async () => {
    setLoading(true)
    await fetch(`/api/dispatch/complete`, {
      method: 'POST',
      body: JSON.stringify({ jobId: job.id }),
    })
    window.location.reload()
  }

  const openNavigation = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${job.customerLat},${job.customerLng}`
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Step 1: Navigate */}
      {job.status === 'ACCEPTED' && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-2xl font-bold">Step 1: Navigate to Customer</h3>
            <div className="text-lg">
              <p><strong>Address:</strong> {job.customerAddress}</p>
              <p><strong>Customer:</strong> {job.customerName}</p>
            </div>
            <Button onClick={openNavigation} className="w-full h-16 text-xl">
              <Navigation className="mr-2 h-6 w-6" />
              Open in Maps
            </Button>
            <Button onClick={handleArrive} variant="outline" className="w-full h-16 text-xl">
              <MapPin className="mr-2 h-6 w-6" />
              I've Arrived
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: PIN Verification */}
      {job.status === 'ARRIVED' && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-2xl font-bold">Step 2: Verify PIN</h3>
            <p className="text-lg">Ask the customer for their 4-digit PIN and verify it matches:</p>
            <div className="text-5xl font-bold text-center p-6 bg-gray-100 rounded-lg">
              {job.pin}
            </div>
            <p className="text-center text-muted-foreground">
              (Customer confirms this on their device)
            </p>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Before Photo */}
      {job.status === 'PIN_VERIFIED' && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-2xl font-bold">Step 3: Take Before Photo</h3>
            <PhotoUploader 
              jobId={job.id} 
              type="BEFORE" 
              onUploadComplete={() => window.location.reload()} 
            />
          </CardContent>
        </Card>
      )}

      {/* Step 4: Start Task */}
      {job.status === 'BEFORE_PHOTO' && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-2xl font-bold">Step 4: Start Task</h3>
            <p className="text-lg">Photo received! Ready to begin?</p>
            <Button onClick={handleStart} className="w-full h-16 text-xl">
              <Play className="mr-2 h-6 w-6" />
              Start Task & Timer
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Active Timer */}
      {job.status === 'IN_PROGRESS' && job.startedAt && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-2xl font-bold">Task In Progress</h3>
            <TimerDisplay
              startedAt={new Date(job.startedAt)}
              durationSeconds={job.durationSecondsPurchased}
              onExpire={() => window.location.reload()}
            />
            <p className="text-center text-muted-foreground">
              Waiting for customer decision when time expires...
            </p>
          </CardContent>
        </Card>
      )}

      {/* Step 6: After Photo */}
      {job.status === 'TIME_EXPIRED' && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-2xl font-bold">Step 5: Take After Photo</h3>
            <PhotoUploader 
              jobId={job.id} 
              type="AFTER" 
              onUploadComplete={() => window.location.reload()} 
            />
          </CardContent>
        </Card>
      )}

      {/* Step 7: Complete */}
      {job.status === 'AFTER_PHOTO' && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-2xl font-bold">Final Step: Complete Task</h3>
            <Button onClick={handleComplete} className="w-full h-16 text-xl bg-green-600">
              <CheckCircle className="mr-2 h-6 w-6" />
              Finish & Complete
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
