'use client'

import { useEffect, useState } from 'react'

interface TimerDisplayProps {
  startedAt: Date
  durationSeconds: number
  onExpire: () => void
  warningThreshold?: number // seconds before end to warn
  onWarning?: () => void
}

export function TimerDisplay({ 
  startedAt, 
  durationSeconds, 
  onExpire,
  warningThreshold = 300, // 5 minutes
  onWarning 
}: TimerDisplayProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [warned, setWarned] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)
      const remaining = Math.max(0, durationSeconds - elapsed)
      
      setTimeLeft(remaining)

      if (remaining <= warningThreshold && !warned && onWarning) {
        setWarned(true)
        onWarning()
      }

      if (remaining === 0) {
        onExpire()
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [startedAt, durationSeconds, onExpire, warningThreshold, onWarning, warned])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const isWarning = timeLeft <= warningThreshold

  return (
    <div className={`text-4xl font-bold text-center p-6 rounded-lg ${
      isWarning ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-green-100 text-green-800'
    }`}>
      {minutes}:{seconds.toString().padStart(2, '0')}
      {isWarning && <div className="text-lg mt-2">Time running out!</div>}
    </div>
  )
}
