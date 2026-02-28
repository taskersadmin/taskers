'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mic } from 'lucide-react'

export default function Request60Page() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          serviceType: 'MINUTES_60',
          priceId: process.env.NEXT_PUBLIC_PRICE_125_60,
        }),
      })
      
      const { jobId } = await res.json()
      router.push(`/review/${jobId}`)
    } catch (error) {
      console.error('Failed to create job:', error)
      setLoading(false)
    }
  }

  const startSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setFormData(prev => ({ ...prev, description: prev.description + ' ' + transcript }))
      }
      recognition.start()
    }
  }

  const isValid = formData.name && formData.phone && formData.address

  return (
    <div className="max-w-xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">1 Hour Service - $125</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Service Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter full address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Task Description</Label>
              <div className="relative">
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="Describe what you need help with..."
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute bottom-2 right-2"
                  onClick={startSpeechRecognition}
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 text-xl" 
              disabled={!isValid || loading}
            >
              {loading ? 'Processing...' : 'Continue to Review'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
