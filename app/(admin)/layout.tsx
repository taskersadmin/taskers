import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  if (session?.user?.role !== 'ADMIN') {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b p-4 bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">TASKERS Admin</h1>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-4">
        {children}
      </main>
    </div>
  )
}
