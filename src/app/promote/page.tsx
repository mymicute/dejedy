'use client'

import { useState, useEffect, Suspense } from 'react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { getStripe, SUBSCRIPTION_PRICES } from '@/lib/stripe'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, CheckCircle2, XCircle, Shield, Lock, Sparkles, ArrowLeft, Check, Zap, Crown, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Tier = 'basic' | 'pro' | 'premium'

const tierIcons = {
  basic: Zap,
  pro: Crown,
  premium: Rocket,
}

const tierColors = {
  basic: 'from-blue-500 to-cyan-500',
  pro: 'from-violet-500 to-purple-600',
  premium: 'from-rose-500 to-pink-600',
}

function PromoteCheckoutForm({
  tier,
  propertyId,
  property,
  userId,
  clientSecret,
  paymentIntentId,
  onSuccess,
}: {
  tier: Tier
  propertyId?: string
  property?: any
  userId: string
  clientSecret: string
  paymentIntentId: string
  onSuccess: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isReady, setIsReady] = useState(false)

  const priceData = SUBSCRIPTION_PRICES[tier]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements || !clientSecret) return

    setLoading(true)
    setError('')

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message || 'Validation failed')
      setLoading(false)
      return
    }

    const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: 'if_required',
    })

    if (paymentError) {
      setError(paymentError.message || 'Payment failed')
      setLoading(false)
      return
    }

    if (paymentIntent?.status === 'succeeded') {
      await fetch('/api/payment-intent/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId }),
      })
      onSuccess()
    }
    setLoading(false)
  }

  const TierIcon = tierIcons[tier]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className={cn(
        "p-6 rounded-2xl border bg-gradient-to-br",
        tier === 'basic' && "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200/50 dark:border-blue-800/30",
        tier === 'pro' && "from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-violet-200/50 dark:border-violet-800/30",
        tier === 'premium' && "from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-rose-200/50 dark:border-rose-800/30"
      )}>
        <div className="flex items-center gap-3 mb-4">
          <div className={cn("p-2 rounded-xl bg-gradient-to-r", tierColors[tier])}>
            <TierIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm">{priceData.name}</h3>
            {property && <p className="text-xs text-zinc-500">{property.title}</p>}
          </div>
        </div>
        <ul className="space-y-2 mb-4">
          {priceData.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <Check className="h-4 w-4 text-emerald-500" />
              {feature}
            </li>
          ))}
        </ul>
        <div className="flex justify-between items-center pt-4 border-t border-zinc-200/50 dark:border-zinc-700/30">
          <span className="font-medium">Total</span>
          <span className="text-2xl font-bold">
            ${(priceData.amount / 100).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-lg">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <Lock className="h-4 w-4 text-emerald-600" />
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Secure Payment</span>
        </div>
        <div className="min-h-[200px] max-h-[400px] overflow-y-auto">
          <PaymentElement 
            onReady={() => setIsReady(true)}
            options={{ layout: 'tabs' }}
          />
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 flex items-center gap-3"
          >
            <XCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        type="submit"
        disabled={!stripe || !elements || loading || !isReady}
        className={cn(
          "w-full h-14 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-300 bg-gradient-to-r",
          tierColors[tier]
        )}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing...
          </span>
        ) : !isReady ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading...
          </span>
        ) : (
          `Subscribe for $${(priceData.amount / 100).toLocaleString()}`
        )}
      </Button>

      <div className="flex items-center justify-center gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-1">
          <Shield className="h-3 w-3" />
          <span>Protected by Stripe</span>
        </div>
      </div>
    </form>
  )
}

function PromotePageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tierParam = searchParams.get('tier') as Tier | null
  const propertyId = searchParams.get('propertyId')

  const [selectedTier, setSelectedTier] = useState<Tier>(tierParam || 'pro')
  const [property, setProperty] = useState<any>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState('')
  const [paymentIntentId, setPaymentIntentId] = useState('')
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [showPayment, setShowPayment] = useState(!!tierParam)

  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push(`/auth?redirect=/promote${propertyId ? `?propertyId=${propertyId}` : ''}`)
        return
      }
      setUserId(user.id)

      if (propertyId) {
        const { data: prop } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .single()
        setProperty(prop)
      }

      setLoading(false)
    }

    init()
  }, [propertyId, router, supabase])

  const createPaymentIntent = async (tier: Tier) => {
    if (!userId) return
    
    setLoading(true)
    setError('')

    const res = await fetch('/api/payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'subscription', tier, propertyId, userId }),
    })

    const data = await res.json()
    if (data.error) {
      setError(data.error)
      setLoading(false)
      return
    }

    setClientSecret(data.clientSecret)
    setPaymentIntentId(data.paymentIntentId)
    setShowPayment(true)
    setLoading(false)
  }

  if (loading && !showPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-violet-50/30 to-purple-50/20 dark:from-black dark:via-zinc-900 dark:to-zinc-900 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-violet-50/30 to-purple-50/20 dark:from-black dark:via-zinc-900 dark:to-zinc-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <CheckCircle2 className="h-10 w-10 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Promotion Activated!</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-md mx-auto">
            Your {SUBSCRIPTION_PRICES[selectedTier].name} is now active. Your listing will get enhanced visibility.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-violet-600 hover:bg-violet-700 rounded-xl h-12 px-8">
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl h-12 px-8">
              <Link href="/dashboard/properties">Manage Listings</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  const stripePromise = getStripe()
  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#8b5cf6',
      borderRadius: '12px',
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-violet-50/30 to-purple-50/20 dark:from-black dark:via-zinc-900 dark:to-zinc-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-200/40 dark:bg-violet-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 relative">
        <Button
          variant="ghost"
          className="mb-8 gap-2 text-zinc-600 hover:text-zinc-900"
          onClick={() => showPayment ? setShowPayment(false) : router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          {showPayment ? 'Change Plan' : 'Back'}
        </Button>

        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 dark:bg-violet-900/30 rounded-full text-violet-700 dark:text-violet-300 text-sm font-medium mb-4"
          >
            <Sparkles className="h-4 w-4" />
            Boost Your Listing
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Promote Your Listing
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            Get more visibility and attract qualified buyers faster with our promotion plans
          </p>
        </div>

        {!showPayment ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {(Object.keys(SUBSCRIPTION_PRICES) as Tier[]).map((tier) => {
              const TierIcon = tierIcons[tier]
              const priceData = SUBSCRIPTION_PRICES[tier]
              const isSelected = selectedTier === tier
              const isPro = tier === 'pro'

              return (
                <motion.div
                  key={tier}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className={cn(
                    "relative bg-white dark:bg-zinc-900 rounded-3xl p-6 border-2 transition-all cursor-pointer",
                    isSelected ? "border-violet-500 shadow-xl shadow-violet-500/20" : "border-zinc-200 dark:border-zinc-800 hover:border-violet-300",
                    isPro && "ring-2 ring-violet-500/20"
                  )}
                  onClick={() => setSelectedTier(tier)}
                >
                  {isPro && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-bold rounded-full">
                      Most Popular
                    </div>
                  )}

                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-r", tierColors[tier])}>
                    <TierIcon className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="text-xl font-bold mb-2">{priceData.name}</h3>
                  <div className="text-3xl font-bold mb-4">
                    ${(priceData.amount / 100).toLocaleString()}
                    <span className="text-sm font-normal text-zinc-500">/one-time</span>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {priceData.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedTier(tier)
                      createPaymentIntent(tier)
                    }}
                    className={cn(
                      "w-full h-12 rounded-xl font-bold transition-all",
                      isSelected
                        ? cn("bg-gradient-to-r text-white", tierColors[tier])
                        : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    )}
                  >
                    {isSelected ? 'Select Plan' : 'Choose'}
                  </Button>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="max-w-lg mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50"
            >
              {clientSecret && userId ? (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                  <PromoteCheckoutForm
                    tier={selectedTier}
                    propertyId={propertyId || undefined}
                    property={property}
                    userId={userId}
                    clientSecret={clientSecret}
                    paymentIntentId={paymentIntentId}
                    onSuccess={() => setSuccess(true)}
                  />
                </Elements>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PromotePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-violet-50/30 to-purple-50/20 dark:from-black dark:via-zinc-900 dark:to-zinc-900 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
      </div>
    }>
      <PromotePageContent />
    </Suspense>
  )
}
