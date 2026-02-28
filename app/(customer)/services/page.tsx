import { ServiceCard } from '@/components/customer/service-card'

export default function ServicesPage() {
  return (
    <div className="space-y-8 py-8">
      <h2 className="text-3xl font-bold text-center">Select Service</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        <ServiceCard
          title="Quick Help"
          price="$75"
          duration="30 Minutes"
          description="Perfect for small tasks and quick fixes"
          href="/request/30"
        />
        <ServiceCard
          title="Standard Help"
          price="$125"
          duration="1 Hour"
          description="For larger tasks and projects"
          href="/request/60"
        />
        <ServiceCard
          title="Add Time"
          price="$50"
          duration="+30 Minutes"
          description="Extend your current session"
          href="/request/add-time"
        />
      </div>
    </div>
  )
}
