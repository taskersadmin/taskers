'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Briefcase, DollarSign, Settings } from 'lucide-react'

export function TaskerNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/tasker/home', label: 'Home', icon: Home },
    { href: '/tasker/offers', label: 'Offers', icon: Briefcase },
    { href: '/tasker/earnings', label: 'Earnings', icon: DollarSign },
    { href: '/tasker/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t md:top-0 md:bottom-auto md:border-b md:border-t-0 z-50">
      <div className="max-w-4xl mx-auto flex justify-around md:justify-start md:space-x-8 p-2 md:p-4">
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 p-2 rounded-lg ${
                isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground'
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-sm md:text-base">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
