'use client'

import { useState } from 'react'
import {
  Bell,
  Shield,
  LogOut,
  Moon,
  Sun,
  Laptop,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark')

  return (
    <div className="max-w-3xl space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-zinc-500 text-sm">
          Control your preferences and account options.
        </p>
      </div>

      {/* NOTIFICATIONS */}
      <Section title="Notifications" icon={Bell}>
        <ToggleRow label="New messages" />
        <ToggleRow label="Booking updates" />
        <ToggleRow label="Saved property alerts" />
      </Section>

      {/* PRIVACY */}
      <Section title="Privacy & Security" icon={Shield}>
        <ToggleRow label="Show online status" />
        <ToggleRow label="Email notifications" />
      </Section>

      {/* ACCOUNT */}
      <Section title="Account Actions" icon={LogOut}>
        <Button
          variant="destructive"
          className="rounded-xl"
          onClick={() => alert('Sign out (UI only)')}
        >
          Sign Out
        </Button>
      </Section>

      {/* APPEARANCE (SMALL, AT THE BOTTOM) */}
      <div className="pt-6 border-t border-zinc-800">
        <p className="text-xs text-zinc-500 mb-3">Appearance</p>

        <div className="flex items-center gap-2">
          <ThemeButton
            active={theme === 'light'}
            icon={Sun}
            onClick={() => setTheme('light')}
          />
          <ThemeButton
            active={theme === 'dark'}
            icon={Moon}
            onClick={() => setTheme('dark')}
          />
          <ThemeButton
            active={theme === 'system'}
            icon={Laptop}
            onClick={() => setTheme('system')}
          />
        </div>
      </div>
    </div>
  )
}

/* ---------- SMALL COMPONENTS ---------- */

function Section({ title, icon: Icon, children }: any) {
  return (
    <Card className="rounded-2xl border border-zinc-800 bg-zinc-900">
      <CardContent className="p-6 space-y-5">
        <div className="flex items-center gap-3">
          <Icon className="h-4 w-4 text-indigo-400" />
          <h2 className="font-semibold">{title}</h2>
        </div>
        {children}
      </CardContent>
    </Card>
  )
}

function ToggleRow({ label }: any) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-zinc-300">{label}</span>
      <Switch />
    </div>
  )
}

function ThemeButton({ icon: Icon, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'h-9 w-9 rounded-lg flex items-center justify-center border transition',
        active
          ? 'border-indigo-500 text-indigo-400'
          : 'border-zinc-700 text-zinc-400 hover:bg-zinc-800'
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}
