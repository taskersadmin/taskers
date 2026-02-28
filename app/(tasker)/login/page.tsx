'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TaskerLoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [loading, setLoading] = useState(false)

  const requestOtp = async () => {
    setLoading(true)
    await fetch('/api/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    })
    setStep('otp')
    setLoading(false)
  }

  const verifyOtp = async () => {
    setLoading(true)
    const result = await signIn('credentials', {
      phone,
      otp,
      redirect: false,
    })
    
    if (result?.ok) {
      router.push('/tasker/home')
    } else {
      alert('Invalid code')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Tasker Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 'phone' ? (
            <>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  placeholder="+1234567890"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
              <Button 
                onClick={requestOtp} 
                className="w-full h-14 text-xl"
                disabled={loading || phone.length < 10}
              >
                {loading ? 'Sending...' : 'Send Code'}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Enter Code</Label>
                <Input
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  maxLength={6}
                />
              </div>
              <Button 
                onClick={verifyOtp} 
                className="w-full h-14 text-xl"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify'}
              </Button>
              <Button 
                variant="link" 
                onClick={() => setStep('phone')}
                className="w-full"
              >
                Use different number
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
