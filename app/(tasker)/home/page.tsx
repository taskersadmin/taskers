'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default function TaskerHomePage() {
  const [available, setAvailable] = useState(false)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch('/api/users/me')
      .then(res => res.json())
      .then(data => {
        setStats(data)
        setAvailable(data.available)
      })
  }, [])

  const toggleAvailable = async () => {
    const newStatus = !available
    setAvailable(newStatus)
    await fetch('/api/users/me', {
      method: 'PATCH',
      body: JSON.stringify({ available: newStatus }),
    })
  }

  if (!stats) return <div>Loading...</div>

  return (
    <div className="space-y-6 py-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Welcome, {stats.name}</h2>
              <p className="text-muted-foreground">ID: {stats.taskerIdNumber}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="available" 
                checked={available}
                onCheckedChange={toggleAvailable}
              />
              <Label htmlFor="available" className="text-lg">
                {available ? 'Available' : 'Offline'}
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold">{stats.completedJobsCount}</div>
            <div className="text-muted-foreground">Jobs Done</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold">${(stats.earningsTotal / 100).toFixed(0)}</div>
            <div className="text-muted-foreground">Total Earned</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2">Next Payout</h3>
          <div className="flex justify-between items-center">
            <span>${(stats.nextPayAmount / 100).toFixed(2)}</span>
            <span className="text-muted-foreground">
              {stats.nextPayDate ? new Date(stats.nextPayDate).toLocaleDateString() : 'Pending'}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <Button className="h-16 text-xl" asChild>
          <a href="/tasker/offers">View Offers</a>
        </Button>
        <Button variant="outline" className="h-16 text-xl" asChild>
          <a href="/tasker/earnings">Earnings History</a>
        </Button>
      </div>
    </div>
  )
}
