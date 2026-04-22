'use client'

import { Heart, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export default function PropertiesPage() {
  const savedProperties = [
    {
      id: 1,
      title: 'Luxury Apartment',
      price: '₦850,000 / year',
      location: 'Lekki Phase 1',
    },
    {
      id: 2,
      title: 'Modern Duplex',
      price: '₦2,500,000 / year',
      location: 'Ikoyi',
    },
    {
      id: 3,
      title: 'Cozy Studio',
      price: '₦450,000 / year',
      location: 'Yaba',
    },
  ]

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold">Saved Properties</h1>
        <p className="text-sm text-zinc-500">
          Properties you’ve liked or bookmarked.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedProperties.map(property => (
          <Card
            key={property.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-zinc-800 transition"
          >
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-lg">
                  {property.title}
                </h3>
                <Heart className="h-4 w-4 text-rose-400" />
              </div>

              <p className="text-sm text-zinc-400 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {property.location}
              </p>

              <p className="font-bold">{property.price}</p>

              <Link
                href="/browse"
                className="text-sm text-indigo-400 hover:underline"
              >
                View property
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
