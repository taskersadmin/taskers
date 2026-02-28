import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="space-y-8 py-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold">Need a Helping Hand?</h2>
        <p className="text-xl text-muted-foreground">
          Book trusted helpers in minutes. Simple, fast, and reliable.
        </p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 space-y-6">
          <Link href="/services">
            <Button className="w-full h-20 text-2xl" size="lg">
              Start Booking
            </Button>
          </Link>
          
          <a href="https://taskers-marketing.com" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full h-16 text-xl">
              Visit Our Site
            </Button>
          </a>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
        <div className="text-center p-6">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-bold">Fast Dispatch</h3>
          <p className="text-muted-foreground">Nearest tasker assigned automatically</p>
        </div>
        <div className="text-center p-6">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-xl font-bold">Safe & Secure</h3>
          <p className="text-muted-foreground">Verified taskers and secure payments</p>
        </div>
        <div className="text-center p-6">
          <div className="text-4xl mb-4">✓</div>
          <h3 className="text-xl font-bold">Satisfaction Guaranteed</h3>
          <p className="text-muted-foreground">Before/after photo documentation</p>
        </div>
      </div>
    </div>
  )
}
