interface Step {
  label: string
  status: 'completed' | 'current' | 'pending'
}

interface JobStatusStepperProps {
  currentStatus: string
}

const STATUS_ORDER = [
  'PAID',
  'ACCEPTED',
  'EN_ROUTE',
  'ARRIVED',
  'BEFORE_PHOTO',
  'IN_PROGRESS',
  'COMPLETED'
]

export function JobStatusStepper({ currentStatus }: JobStatusStepperProps) {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus)
  
  const steps: Step[] = STATUS_ORDER.map((status, index) => ({
    label: status.replace(/_/g, ' '),
    status: index < currentIndex ? 'completed' : index === currentIndex ? 'current' : 'pending'
  }))

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.label} className="flex flex-col items-center flex-1">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
              ${step.status === 'completed' ? 'bg-green-500 text-white' : 
                step.status === 'current' ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' : 
                'bg-gray-200 text-gray-500'}
            `}>
              {index + 1}
            </div>
            <span className="text-xs mt-2 text-center hidden sm:block">{step.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <span className="text-xl font-semibold">
          Current: {steps[currentIndex]?.label || 'Processing'}
        </span>
      </div>
    </div>
  )
}
