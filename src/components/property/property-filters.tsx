'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

export function PropertyFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [q, setQ] = useState(searchParams.get('q') || '')
  const [type, setType] = useState(searchParams.get('type') || 'all')
  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [priceRange, setPriceRange] = useState([
    parseInt(searchParams.get('minPrice') || '0'),
    parseInt(searchParams.get('maxPrice') || '10000000')
  ])
  const [beds, setBeds] = useState(searchParams.get('beds') || 'any')

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (type !== 'all') params.set('type', type)
    if (category !== 'all') params.set('category', category)
    if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString())
    if (priceRange[1] < 10000000) params.set('maxPrice', priceRange[1].toString())
    if (beds !== 'any') params.set('beds', beds)
    
    router.push(`/browse?${params.toString()}`)
  }

  const resetFilters = () => {
    setQ('')
    setType('all')
    setCategory('all')
    setPriceRange([0, 10000000])
    setBeds('any')
    router.push('/browse')
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input 
            placeholder="City, neighborhood..." 
            className="pl-9"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Transaction Type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="Any Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Type</SelectItem>
            <SelectItem value="sale">For Sale</SelectItem>
            <SelectItem value="rent">For Rent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Property Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Any Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Category</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="office">Office</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Price Range</Label>
          <span className="text-xs font-medium text-zinc-500">
            ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
          </span>
        </div>
        <Slider
          defaultValue={[0, 10000000]}
          max={10000000}
          step={50000}
          value={priceRange}
          onValueChange={setPriceRange}
          className="py-4"
        />
      </div>

      <div className="space-y-2">
        <Label>Bedrooms</Label>
        <div className="flex flex-wrap gap-2">
          {['any', '1', '2', '3', '4', '5+'].map((num) => (
            <Badge
              key={num}
              variant={beds === num ? 'default' : 'outline'}
              className="cursor-pointer px-3 py-1 text-sm font-medium"
              onClick={() => setBeds(num)}
            >
              {num === 'any' ? 'Any' : `${num}${num === '5+' ? '' : ' Beds'}`}
            </Badge>
          ))}
        </div>
      </div>

      <div className="pt-4 space-y-2">
        <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={applyFilters}>
          Apply Filters
        </Button>
        <Button variant="ghost" className="w-full" onClick={resetFilters}>
          Reset All
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Filter Sidebar */}
      <div className="hidden lg:block w-80 shrink-0 border-r p-6 bg-white dark:bg-black h-[calc(100vh-64px)] overflow-y-auto sticky top-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            Filters
          </h2>
        </div>
        <FilterContent />
      </div>

      {/* Mobile Filter Sheet */}
      <div className="lg:hidden w-full p-4 border-b bg-white dark:bg-black sticky top-16 z-30">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full flex justify-between">
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </span>
              <Badge variant="secondary" className="ml-2">
                {searchParams.size}
              </Badge>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader className="mb-6">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <FilterContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

