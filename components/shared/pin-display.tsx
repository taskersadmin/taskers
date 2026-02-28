'use client'

interface PinDisplayProps {
  pin: string
  label?: string
}

export function PinDisplay({ pin, label = "Your PIN" }: PinDisplayProps) {
  return (
    <div className="bg-primary text-primary-foreground p-8 rounded-xl text-center">
      <div className="text-lg mb-2 opacity-90">{label}</div>
      <div className="text-5xl font-bold tracking-widest">{pin}</div>
      <div className="text-sm mt-4 opacity-90">
        Share this with your Tasker when they arrive
      </div>
    </div>
  )
}
