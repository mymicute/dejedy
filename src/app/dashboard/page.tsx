'use client'

import {
  Heart,
  MessageSquare,
  Clock,
  ShieldCheck,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

export default function DashboardPage() {
  const profile = {
    full_name: 'Demo User',
  }

  const stats = {
    saved: 4,
    messages: 2,
    bookings: 1,
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {profile.full_name.split(' ')[0]}!
        </h1>
        <p className="text-zinc-500 text-sm">
          Dashboard preview — backend not connected yet.
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatButton
          href="/dashboard/saved"
          icon={Heart}
          label="Saved Properties"
          value={stats.saved}
          color="bg-rose-500/10 text-rose-400"
        />

        <StatButton
          href="/dashboard/messages"
          icon={MessageSquare}
          label="Messages"
          value={stats.messages}
          color="bg-indigo-500/10 text-indigo-400"
        />

        <StatButton
          href="/dashboard/bookings"
          icon={Clock}
          label="Bookings"
          value={stats.bookings}
          color="bg-amber-500/10 text-amber-400"
        />

        <StatButton
          href="/dashboard/account"
          icon={ShieldCheck}
          label="Account"
          value="Verified"
          color="bg-emerald-500/10 text-emerald-400"
        />
      </div>

      {/* NOTIFICATIONS */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Recent Notifications</h2>

        <Notification
          icon={MessageSquare}
          title="New Message"
          desc="You received a new inquiry."
          time="2 mins ago"
        />

        <Notification
          icon={Clock}
          title="Booking Confirmed"
          desc="Inspection scheduled."
          time="1 hour ago"
        />
      </div>
    </div>
  )
}

/* ---------- COMPONENTS ---------- */

function StatButton({ href, icon: Icon, label, value, color }: any) {
  return (
    <Link href={href}>
      <Card className="rounded-2xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 transition cursor-pointer">
        <CardContent className="p-4 md:p-6">
          <div className={cn('p-2 md:p-3 rounded-2xl w-fit mb-3', color)}>
            <Icon className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <p className="text-xs md:text-sm text-zinc-400">{label}</p>
          <h3 className="text-xl md:text-2xl font-bold">{value}</h3>
        </CardContent>
      </Card>
    </Link>
  )
}

function Notification({ icon: Icon, title, desc, time }: any) {
  return (
    <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex gap-4">
      <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center">
        <Icon className="h-5 w-5 text-indigo-400" />
      </div>
      <div>
        <h4 className="font-bold text-sm">{title}</h4>
        <p className="text-xs text-zinc-400">{desc}</p>
        <span className="text-[10px] text-zinc-500">{time}</span>
      </div>
    </div>
  )
}
