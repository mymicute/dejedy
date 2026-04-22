'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Home,
  Search,
  MessageSquare,
  PlusCircle,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)

  // 🔹 Demo user (Supabase disabled)
  useEffect(() => {
    setUser({
      email: 'demo@user.com',
      user_metadata: { name: 'Demo User' },
    })

    setProfile({
      id: 'demo-id',
      full_name: 'Demo User',
      role: 'user',
    })
  }, [])

  const navLinks = [
    { name: 'Browse', href: '/browse', icon: Search },
    { name: 'Dashboard', href: '/dashboard', icon: Home, auth: true },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-black/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                R
              </div>
              <span className="hidden sm:block text-xl font-bold">
                realmiweb
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) =>
                link.auth && !user ? null : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      'px-3 py-2 rounded-md text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800',
                      pathname === link.href
                        ? 'text-indigo-600'
                        : 'text-zinc-600 dark:text-zinc-400'
                    )}
                  >
                    {link.name}
                  </Link>
                )
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {profile?.role === 'agent' && (
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/properties/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  List Property
                </Link>
              </Button>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                    <Avatar>
                      <AvatarImage />
                      <AvatarFallback>
                        {profile?.full_name?.[0] ?? 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium">
                      {profile?.full_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                      <Home className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" asChild size="sm">
                  <Link href="/auth">Sign In</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/auth">Get Started</Link>
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
