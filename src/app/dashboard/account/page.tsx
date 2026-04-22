'use client'

import { ShieldCheck, Mail, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AccountPage() {
  const profile = {
    full_name: 'Demo User',
    email: 'demo@realmiweb.com',
    role: 'Buyer',
    verified: true,
    avatar_url: '',
  }

  return (
    <div className="max-w-3xl space-y-8">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold">My Account</h1>
        <p className="text-zinc-500 text-sm">
          View and manage your profile information.
        </p>
      </div>

      {/* PROFILE CARD */}
      <Card className="rounded-3xl border border-zinc-800 bg-zinc-900">
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="text-2xl">
                {profile.full_name[0]}
              </AvatarFallback>
            </Avatar>

            <div>
              <h2 className="text-xl font-bold">{profile.full_name}</h2>
              <p className="text-zinc-400 text-sm">{profile.role} Account</p>

              {profile.verified && (
                <div className="flex items-center gap-1 mt-1 text-emerald-400 text-sm">
                  <ShieldCheck className="h-4 w-4" />
                  Verified account
                </div>
              )}
            </div>
          </div>

          {/* INFO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoItem icon={User} label="Full Name" value={profile.full_name} />
            <InfoItem icon={Mail} label="Email" value={profile.email} />
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="rounded-xl">Edit Profile</Button>
            <Button variant="outline" className="rounded-xl">
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ---------- SMALL COMPONENT ---------- */

function InfoItem({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-800/50">
      <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center">
        <Icon className="h-5 w-5 text-indigo-400" />
      </div>
      <div>
        <p className="text-xs text-zinc-500">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  )
}
