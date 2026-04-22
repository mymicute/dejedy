'use client'

import { Calendar, MapPin, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function BookingsPage() {
  const bookings = [
    {
      id: 1,
      property: '3 Bedroom Apartment – Lekki',
      date: 'Tomorrow',
      time: '12:00 PM',
      location: 'Lekki Phase 1',
      status: 'Confirmed',
    },
    {
      id: 2,
      property: 'Modern Duplex – Ikoyi',
      date: 'Friday',
      time: '10:30 AM',
      location: 'Ikoyi',
      status: 'Pending',
    },
  ]

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="text-sm text-zinc-500">
          View and manage your scheduled property inspections.
        </p>
      </header>

      <div className="grid gap-4">
        {bookings.map(booking => (
          <Card
            key={booking.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl"
          >
            <CardContent className="p-5 space-y-3">
              <h3 className="font-semibold text-lg">
                {booking.property}
              </h3>

              <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> {booking.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {booking.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {booking.location}
                </span>
              </div>

              <span
                className={`inline-block text-xs px-3 py-1 rounded-full w-fit ${
                  booking.status === 'Confirmed'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-amber-500/10 text-amber-400'
                }`}
              >
                {booking.status}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
