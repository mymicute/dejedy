'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PropertyGalleryProps {
  images: string[]
}

export function PropertyGallery({ images }: PropertyGalleryProps) {
  const [current, setCurrent] = useState(0)
  
  const displayImages = images.length > 0 
    ? images 
    : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80']

  const next = () => setCurrent((prev) => (prev + 1) % displayImages.length)
  const prev = () => setCurrent((prev) => (prev - 1 + displayImages.length) % displayImages.length)

  return (
    <div className="space-y-4">
      <div className="relative aspect-video rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 group">
        <Image
          src={displayImages[current]}
          alt={`Property image ${current + 1}`}
          fill
          className="object-cover transition-all duration-500"
          priority
        />
        
        {displayImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={prev}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={next}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}
        
        <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium">
          <Maximize2 className="h-3 w-3" />
          {current + 1} / {displayImages.length}
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {displayImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={cn(
              "relative flex-shrink-0 w-24 aspect-video rounded-xl overflow-hidden border-2 transition-all",
              current === idx ? "border-indigo-600 ring-2 ring-indigo-600/20" : "border-transparent opacity-60 hover:opacity-100"
            )}
          >
            <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
