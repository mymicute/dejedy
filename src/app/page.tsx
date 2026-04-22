import { Hero } from '@/components/layout/hero'
import { FeaturedProperties } from '@/components/property/featured-properties'
import { Button } from '@/components/ui/button'
import {
  Building2,
  Home,
  Key,
  ShieldCheck,
  TrendingUp,
  Users,
  Sofa,
  Laptop,
  Car,
  Wrench
} from "lucide-react"

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      {/* Property Categories */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Explore by Property Type</h2>
            <p className="text-zinc-600 dark:text-zinc-400">Find exactly what you're looking for</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
  {[
    { name: 'Houses', icon: Home, count: '1,240+', color: 'bg-blue-50 text-blue-600' },
    { name: 'Apartments', icon: Building2, count: '850+', color: 'bg-purple-50 text-purple-600' },
    { name: 'Villas', icon: Key, count: '420+', color: 'bg-amber-50 text-amber-600' },
    { name: 'Offices', icon: Building2, count: '180+', color: 'bg-emerald-50 text-emerald-600' },

    // NEW CATEGORIES
    { name: 'Furniture', icon: Sofa, count: '640+', color: 'bg-rose-50 text-rose-600' },
    { name: 'Electronics', icon: Laptop, count: '1,150+', color: 'bg-indigo-50 text-indigo-600' },
    { name: 'Cars', icon: Car, count: '320+', color: 'bg-green-50 text-green-600' },
    { name: 'Services', icon: Wrench, count: '900+', color: 'bg-orange-50 text-orange-600' },
  ].map((cat) => (
    <Link
      key={cat.name}
      href={`/browse?type=${cat.name.toLowerCase()}`}
      className="group p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:border-indigo-500 transition-all text-center hover:shadow-xl hover:shadow-indigo-500/10"
    >
      <div
        className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}
      >
        <cat.icon className="h-8 w-8" />
      </div>

      <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
      <p className="text-sm text-zinc-500">{cat.count} listings</p>
    </Link>
  ))}
</div>

        </div>
      </section>

      <FeaturedProperties />

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-black overflow-hidden">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Trusted by 50,000+ users
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                Everything you need to find and secure your next home.
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                Our platform combines cutting-edge technology with deep real estate expertise to provide a seamless experience for buyers, renters, and agents alike.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                <div className="space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h4 className="font-bold">Predictive Analytics</h4>
                  <p className="text-sm text-zinc-500">Get AI-powered insights on property valuations and investment potential.</p>
                </div>
                <div className="space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <Users className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h4 className="font-bold">Verified Professional</h4>
                  <p className="text-sm text-zinc-500">Connect with highly-rated agents and landlords with verified badges.</p>
                </div>
              </div>

              <div className="pt-6">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8" asChild>
                  <Link href="/auth">Create Free Account</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Modern House" />
                  </div>
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1600607687940-4e5272335ad5?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Interior" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Dining" />
                  </div>
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Luxury Home" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600 dark:bg-indigo-900">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Are You a Real Estate Professional?</h2>
          <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of agents and landlords who use realmiweb to list properties, manage leads, and grow their business.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" className="h-12 px-8 font-semibold" asChild>
              <Link href="/auth">List Your First Property</Link>
            </Button>
            <Button size="lg" className="h-12 px-8 bg-white/10 hover:bg-white/20 border-white/20 text-white font-semibold" asChild>
              <Link href="/agent-features">Learn More About Agent Tools</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-black">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
            <div className="col-span-2 lg:col-span-2">
                <Link href="/" className="flex items-center gap-2 mb-6">
                  <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">R</div>
                  <span className="text-xl font-bold tracking-tight">realmiweb</span>
                </Link>
                <p className="text-zinc-500 max-w-sm mb-8">
                  The most advanced real estate platform for the modern era in Nigeria. Search, discover, and secure your perfect home with ease.
                </p>
              <div className="flex gap-4">
                {/* Social icons placeholder */}
                <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6">Discovery</h4>
              <ul className="space-y-4 text-zinc-500 text-sm">
                <li><Link href="/browse">All Properties</Link></li>
                <li><Link href="/browse?type=sale">For Sale</Link></li>
                <li><Link href="/browse?type=rent">For Rent</Link></li>
                <li><Link href="/browse?category=villas">Luxury Villas</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-zinc-500 text-sm">
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/careers">Careers</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-zinc-500 text-sm">
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
                <li><Link href="/cookies">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
            <p>© 2026 realmiweb Inc. All rights reserved.</p>
            <div className="flex gap-8">
              <span>English (Nigeria)</span>
              <span>NGN (₦)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
