'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Property } from '@/types'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

// Fix for Leaflet default icon issues in Next.js
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

interface PropertyMapProps {
  properties: Property[]
  center?: [number, number]
  zoom?: number
}

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  return null
}

export default function PropertyMap({ properties, center = [40.7128, -74.0060], zoom = 12 }: PropertyMapProps) {
  // Calculate average center if properties exist and no center provided
  const mapCenter = properties.length > 0 
    ? [properties[0].latitude, properties[0].longitude] as [number, number]
    : center

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer 
        center={mapCenter} 
        zoom={zoom} 
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={mapCenter} zoom={zoom} />
        {properties.map((property) => (
          <Marker 
            key={property.id} 
            position={[property.latitude, property.longitude]} 
            icon={defaultIcon}
          >
            <Popup>
              <div className="w-48 p-1">
                <div className="aspect-video relative rounded-md overflow-hidden mb-2">
                  <img 
                    src={property.images[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'} 
                    alt={property.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="font-bold text-sm mb-1 line-clamp-1">{property.title}</h3>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-indigo-600">${property.price.toLocaleString()}</span>
                  <Badge variant="outline" className="text-[10px] px-1 h-4">
                    {property.type === 'sale' ? 'Sale' : 'Rent'}
                  </Badge>
                </div>
                <Link 
                  href={`/property/${property.id}`}
                  className="mt-2 block text-center text-[10px] font-bold text-white bg-indigo-600 rounded py-1 hover:bg-indigo-700 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
