import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { TaskerNav } from '@/components/tasker/tasker-nav'

export default async function TaskerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  if (!session && !['/', '/login'].includes('')) {
    redirect('/tasker/login')
  }

  return (
    <div className="min-h-screen bg-background">
      {session && <TaskerNav />}
      <main className="max-w-4xl mx-auto p-4 pb-20">
        {children}
      </main>
    </div>
  )
}
