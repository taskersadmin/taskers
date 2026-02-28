import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminDashboard() {
  const stats = await prisma.$transaction([
    prisma.job.count(),
    prisma.job.count({ where: { status: 'COMPLETED' } }),
    prisma.taskerProfile.count(),
    prisma.taskerProfile.count({ where: { available: true } }),
  ])

  return (
    <div className="grid grid-cols-4 gap-6 py-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{stats[0]}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{stats[1]}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Taskers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{stats[2]}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Available Now</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{stats[3]}</div>
        </CardContent>
      </Card>
    </div>
  )
}
