'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ActiveJobFlow } from '@/components/tasker/active-job-flow'

export default function TaskerJobPage() {
  const { jobId } = useParams()
  const [job, setJob] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/jobs/${jobId}`)
      .then(res => res.json())
      .then(data => setJob(data))
  }, [jobId])

  if (!job) return <div>Loading...</div>

  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold mb-6">Active Job #{job.jobNumber}</h2>
      <ActiveJobFlow job={job} />
    </div>
  )
}
