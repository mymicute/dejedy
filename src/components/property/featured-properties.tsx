'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PropertyCard } from './property-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export function FeaturedProperties() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchProperties = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6)
      
      if (!error && data) {
        setProperties(data)
      }
      setLoading(false)
    }

    fetchProperties()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <section className="py-20 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Featured Properties
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                Explore our handpicked selection of premium properties across Nigeria, ranging from luxury villas in Lekki to cozy apartments in Abuja.
              </p>
            </div>
          <Button asChild variant="outline" className="hidden md:flex gap-2">
            <Link href="/browse">
              View All Properties
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Button asChild className="w-full bg-indigo-600">
            <Link href="/browse">View All Properties</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
