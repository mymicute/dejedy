'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Property, Profile } from '@/types'
import { PropertyGallery } from '@/components/property/property-gallery'
import { InquiryForm } from '@/components/property/inquiry-form'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Bed, Bath, Square, MapPin, Calendar, 
  Share2, Heart, ShieldCheck, Check, 
  ChevronLeft, Loader2, Phone, Mail, Clock, CreditCard
} from 'lucide-react'
import { toast } from 'sonner'

const PropertyMap = dynamic(() => import('@/components/property/property-map'), {
  ssr: false,
  loading: () => <div className="h-64 bg-zinc-100 animate-pulse rounded-2xl" />
})

export default function PropertyDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [agent, setAgent] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!id) return

      const { data: prop, error: propError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()

      if (propError || !prop) {
        toast.error('Property not found')
        router.push('/browse')
        return
      }

      setProperty(prop as Property)

      if (prop.owner_id) {
        const { data: agentData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', prop.owner_id)
          .single()
        
        if (agentData) setAgent(agentData as Profile)
      }
      
      setLoading(false)
    }

    fetchPropertyData()
  }, [id, supabase, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (!property) return null

  return (
    <div className="bg-zinc-50 dark:bg-black min-h-screen pb-20">
      <div className="container px-4 mx-auto py-8">
        <Button 
          variant="ghost" 
          className="mb-6 gap-2 text-zinc-600 hover:text-zinc-900"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Search
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <PropertyGallery images={property.images} />

            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-sm border border-zinc-100 dark:border-zinc-800">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={property.type === 'sale' ? 'bg-indigo-600' : 'bg-emerald-600'}>
                      For {property.type === 'sale' ? 'Sale' : 'Rent'}
                    </Badge>
                    <Badge variant="outline" className="bg-zinc-100 dark:bg-zinc-800 border-none">
                      {property.property_category}
                    </Badge>
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight mb-2">{property.title}</h1>
                  <div className="flex items-center text-zinc-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{property.address}, {property.city}, {property.state} {property.zip_code}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-indigo-600">
                    ${property.price.toLocaleString()}
                    {property.type === 'rent' && <span className="text-lg font-normal text-zinc-500">/mo</span>}
                  </div>
                  <p className="text-sm text-zinc-500 mt-1">Est. Mortgage: $4,250/mo</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-6 border-y border-zinc-100 dark:border-zinc-800">
                <div className="flex flex-col items-center p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                  <Bed className="h-6 w-6 text-indigo-600 mb-2" />
                  <span className="font-bold">{property.bedrooms}</span>
                  <span className="text-xs text-zinc-500">Bedrooms</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                  <Bath className="h-6 w-6 text-indigo-600 mb-2" />
                  <span className="font-bold">{property.bathrooms}</span>
                  <span className="text-xs text-zinc-500">Bathrooms</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                  <Square className="h-6 w-6 text-indigo-600 mb-2" />
                  <span className="font-bold">{property.sqft.toLocaleString()}</span>
                  <span className="text-xs text-zinc-500">sqft Area</span>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Description</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">
                  {property.description || 'No description provided for this property.'}
                </p>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {(property.amenities || ['Parking', 'Pool', 'Security', 'AC', 'Wifi']).map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                      <div className="h-5 w-5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-sm border border-zinc-100 dark:border-zinc-800">
              <h3 className="text-xl font-bold mb-6">Location</h3>
              <div className="h-80 rounded-2xl overflow-hidden">
                <PropertyMap properties={[property]} center={[property.latitude, property.longitude]} zoom={15} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
              <CardHeader className="bg-indigo-600 text-white p-6">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Verified Agent
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-16 w-16 border-2 border-zinc-100">
                    <AvatarImage src={agent?.avatar_url} />
                    <AvatarFallback>{agent?.full_name?.charAt(0) || 'A'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-lg">{agent?.full_name || 'Listing Agent'}</h4>
                    <p className="text-sm text-zinc-500">Member since {agent ? new Date(agent.created_at).getFullYear() : '2024'}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => <span key={i} className="text-sm">★</span>)}
                      </div>
                      <span className="text-xs text-zinc-400 font-medium">(48 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <Phone className="h-4 w-4 text-indigo-600" />
                    <span>{agent?.phone || '+1 (555) 123-4567'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <Mail className="h-4 w-4 text-indigo-600" />
                    <span>agent@estatehub.com</span>
                  </div>
                </div>

<InquiryForm propertyId={property.id} receiverId={property.owner_id || ''} />
                  
                  <Button 
                    asChild
                    className="w-full mt-4 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold shadow-lg shadow-amber-500/20 gap-2"
                  >
                    <Link href={`/checkout?propertyId=${property.id}`}>
                      <CreditCard className="h-4 w-4" />
                      Reserve Property ($5,000 Deposit)
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full mt-4 h-12 rounded-xl border-zinc-200 gap-2">
                    <Calendar className="h-4 w-4" />
                    Book an Inspection
                  </Button>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-none shadow-sm bg-indigo-50 dark:bg-zinc-900/50 p-6">
              <h4 className="font-bold mb-4">Quick Stats</h4>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Days on Market</span>
                  <span className="font-medium">12 days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Views</span>
                  <span className="font-medium">1,240</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Saves</span>
                  <span className="font-medium">84</span>
                </div>
              </div>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 rounded-2xl h-12 gap-2">
                <Heart className="h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" className="flex-1 rounded-2xl h-12 gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
