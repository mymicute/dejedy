'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Heart,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Calendar,
  User
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // UI-ONLY PROFILE
  const profile = {
    full_name: 'Demo User',
    role: 'buyer',
    avatar_url: '',
  }

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    { name: 'Saved Properties', href: '/dashboard/properties', icon: Heart },
    { name: 'Bookings', href: '/dashboard/bookings', icon: Calendar },
    { name: 'Account', href: '/dashboard/account', icon: User },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-black text-white flex">
      
      {/* MOBILE BACKDROP */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={cn(
          'fixed z-50 md:static top-0 left-0 h-full w-64 bg-zinc-900 border-r border-zinc-800 p-4 transition-transform',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback>{profile.full_name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{profile.full_name}</p>
              <p className="text-xs text-zinc-400">Buyer Account</p>
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="md:hidden"
          >
            <X />
          </button>
        </div>

        {/* NAV */}
        <nav className="space-y-1">
          {navItems.map(item => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-sm',
                pathname === item.href
                  ? 'bg-indigo-600 text-white'
                  : 'text-zinc-300 hover:bg-zinc-800'
              )}
              onClick={() => setOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* SIGN OUT */}
        <button className="mt-8 flex items-center gap-3 text-red-400 text-sm">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1">
        {/* MOBILE TOP BAR */}
        <div className="md:hidden flex items-center gap-3 p-4 border-b border-zinc-800">
          <button onClick={() => setOpen(true)}>
            <Menu />
          </button>
          <p className="font-semibold">Dashboard</p>
        </div>

        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
