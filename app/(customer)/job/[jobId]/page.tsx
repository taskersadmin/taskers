'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { JobStatusStepper } from '@/components/customer/job-status-stepper'
import { PinDisplay } from '@/components/shared/pin-display'
import { TimerDisplay } from '@/components/shared/timer-display'
import { AddTimeModal } from '@/components/customer/add-time-modal'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function JobPage() {
  const { jobId } = useParams()
  const [job, setJob] = useState<any>(null)
  const [showAddTime, setShowAddTime] = useState(false)

  useEffect(() => {
    const fetchJob = () => {
      fetch(`/api/jobs/${jobId}`)
        .then(res => res.json())
        .then(data => {
          setJob(data)
          if (data.status === 'TIME_EXPIRED') {
            setShowAddTime(true)
          }
        })
    }

    fetchJob()
    const interval = setInterval(fetchJob, 5000)
    return () => clearInterval(interval)
  }, [jobId])

  if (!job) return <div>Loading...</div>

  return (
    <div className="space-y-6 py-4">
      <h2 className="text-2xl font-bold">Job #{job.jobNumber}</h2>
      
      <JobStatusStepper currentStatus={job.status} />

      {job.status === 'ACCEPTED' && (
        <Card className="bg-blue-50">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2">Tasker Assigned!</h3>
            <p>Your tasker is preparing to head your way.</p>
          </CardContent>
        </Card>
      )}

      {job.status === 'EN_ROUTE' && job.tasker && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-xl font-bold">Tasker On The Way</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-muted-foreground">Name</div>
                <div className="font-semibold text-lg">{job.tasker.name}</div>
              </div>
              <div>
                <div className="text-muted-foreground">ETA</div>
                <div className="font-semibold text-lg">15 min</div>
              </div>
            </div>
            <PinDisplay pin={job.pin} />
          </CardContent>
        </Card>
      )}

      {job.status === 'IN_PROGRESS' && job.startedAt && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4">Task In Progress</h3>
            <TimerDisplay
              startedAt={new Date(job.startedAt)}
              durationSeconds={job.durationSecondsPurchased}
              onExpire={() => window.location.reload()}
            />
          </CardContent>
        </Card>
      )}

      {showAddTime && (
        <AddTimeModal
          jobId={job.id}
          onAddTime={() => setShowAddTime(false)}
          onStop={() => setShowAddTime(false)}
        />
      )}

      {job.status === 'COMPLETED' && (
        <Card className="bg-green-50">
          <CardContent className="p-6 text-center">
            <h3 className="text-2xl font-bold text-green-800 mb-2">Task Complete!</h3>
            <p className="text-green-700">Thank you for using TASKERS</p>
            <Button className="mt-4" variant="outline">
              Rate Your Tasker
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
