// app/(customer)/layout.tsx
import { ThemeToggle } from '@/components/shared/theme-toggle'

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">TASKERS</h1>
          <ThemeToggle />
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-4 pb-20">
        {children}
      </main>
    </div>
  )
}
