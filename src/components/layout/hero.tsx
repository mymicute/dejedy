'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, MapPin, Home, Building2 } from 'lucide-react'
import { motion } from 'framer-motion'

export function Hero() {
  const [search, setSearch] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/browse?q=${encodeURIComponent(search)}`)
    } else {
      router.push('/browse')
    }
  }

  return (
    <section className="relative h-[85vh] w-full overflow-hidden flex items-center justify-center">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")' }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
                Find Your Perfect <span className="text-indigo-400">Home</span> in Nigeria
              </h1>
              <p className="mt-6 text-xl text-zinc-200 max-w-2xl mx-auto">The most advanced digital marketplace for the modern era in Nigeria.
Search, discover, and secure properties, services, electronics, cars, and furniture — all in one seamless platform.
              </p>
            </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl"
          >
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <Input
                  className="w-full pl-10 h-14 bg-white/90 border-0 text-zinc-900 placeholder:text-zinc-500 rounded-xl focus-visible:ring-indigo-500"
                  placeholder="Search by city, neighborhood, or address..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button size="lg" className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold transition-all">
                Search Properties/Service 
              </Button>
            </form>
          </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-6"
            >
              <div className="flex items-center gap-2 text-white/80">
                <Building2 className="h-5 w-5 text-indigo-400" />
                <span className="text-sm font-medium">10k+ Listings</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="h-5 w-5 text-indigo-400" />
                <span className="text-sm font-medium">NewYork, California, Lagos & more</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Home className="h-5 w-5 text-indigo-400" />
                <span className="text-sm font-medium">Verified Local Agents</span>
              </div>
            </motion.div>
        </div>
      </div>
    </section>
  )
}
