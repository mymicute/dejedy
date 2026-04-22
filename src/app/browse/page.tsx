'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { PropertyFilters } from '@/components/property/property-filters'
import { PropertyCard } from '@/components/property/property-card'
import { Property } from '@/types'
import { Button } from '@/components/ui/button'
import {
  Loader2,
  Map as MapIcon,
  List as ListIcon,
  Search,
} from 'lucide-react'

const PropertyMap = dynamic(() => import('@/components/property/property-map'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
    </div>
  ),
})

export default function BrowsePage() {
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')

  useEffect(() => {
    // 🔕 Supabase disabled – demo empty state
    setLoading(true)

    const timer = setTimeout(() => {
      setProperties([]) // empty list on purpose
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchParams])

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
      <PropertyFilters />

      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Mobile toggle */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <Button
            className="rounded-full shadow-2xl bg-zinc-900 text-white h-12 px-6 gap-2"
            onClick={() =>
              setViewMode(viewMode === 'list' ? 'map' : 'list')
            }
          >
            {viewMode === 'list' ? (
              <>
                <MapIcon className="h-4 w-4" /> Show Map
              </>
            ) : (
              <>
                <ListIcon className="h-4 w-4" /> Show List
              </>
            )}
          </Button>
        </div>

        {/* Desktop toggle */}
        <div className="hidden lg:flex items-center justify-between p-4 border-b bg-white dark:bg-black sticky top-16 z-20">
          <h1 className="text-xl font-bold">
            {loading ? 'Searching…' : `${properties.length} Properties found`}
          </h1>

          <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg">
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <ListIcon className="h-4 w-4" /> List
            </Button>
            <Button
              variant={viewMode === 'map' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('map')}
            >
              <MapIcon className="h-4 w-4" /> Map
            </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row">
          {/* List view */}
          <div className={`flex-1 p-4 ${viewMode === 'map' ? 'hidden lg:block' : ''}`}>
            {!loading && properties.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-20 w-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-10 w-10 text-zinc-400" />
                </div>
                <h2 className="text-xl font-bold mb-2">
                  No properties found
                </h2>
                <p className="text-zinc-500 max-w-xs">
                  Try adjusting your filters or search area.
                </p>
              </div>
            )}
          </div>

          {/* Map view */}
          <div
            className={`flex-1 border-l ${
              viewMode === 'list' ? 'hidden lg:block' : ''
            }`}
          >
            <PropertyMap properties={properties} />
          </div>
        </div>
      </main>
    </div>
  )
}
