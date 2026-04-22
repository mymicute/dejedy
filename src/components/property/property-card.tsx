'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bed, Bath, Square, MapPin, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PropertyCardProps {
  property: {
    id: string
    title: string
    price: number
    type: 'sale' | 'rent'
    address: string
    city: string
    bedrooms: number
    bathrooms: number
    sqft: number
    images: string[]
    status: string
  }
  className?: string
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={cn("h-full", className)}
    >
      <Card className="overflow-hidden h-full border-zinc-200 dark:border-zinc-800 flex flex-col group">
        <CardHeader className="p-0 relative aspect-[4/3] overflow-hidden">
          <Link href={`/property/${property.id}`}>
            <Image
              src={property.images[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </Link>
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={cn(
              "font-semibold",
              property.type === 'sale' ? "bg-indigo-600" : "bg-emerald-600"
            )}>
              For {property.type === 'sale' ? 'Sale' : 'Rent'}
            </Badge>
            {property.status !== 'available' && (
              <Badge variant="secondary" className="bg-white/90 text-zinc-900 backdrop-blur-sm">
                {property.status}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 border border-white/30"
          >
            <Heart className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="p-4 flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg line-clamp-1 group-hover:text-indigo-600 transition-colors">
              <Link href={`/property/${property.id}`}>{property.title}</Link>
            </h3>
          </div>
          <div className="flex items-center text-zinc-500 dark:text-zinc-400 text-sm mb-4">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">{property.address}, {property.city}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-y border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-1 text-sm font-medium">
              <Bed className="h-4 w-4 text-indigo-500" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium">
              <Bath className="h-4 w-4 text-indigo-500" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium">
              <Square className="h-4 w-4 text-indigo-500" />
              <span>{property.sqft} sqm</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center mt-auto">
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            ₦{property.price.toLocaleString()}
            {property.type === 'rent' && <span className="text-sm font-normal text-zinc-500">/mo</span>}
          </div>
          <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 p-0 font-semibold" asChild>
            <Link href={`/property/${property.id}`}>Details →</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
