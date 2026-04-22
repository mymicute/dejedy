'use client'

import { useState, useEffect, Suspense } from 'react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { getStripe, DEPOSIT_AMOUNT } from '@/lib/stripe'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, CheckCircle2, XCircle, Shield, Lock, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function DepositCheckoutForm({ 
  propertyId, 
  property,
  userId,
  clientSecret,
  paymentIntentId,
  onSuccess 
}: { 
  propertyId: string
  property: any
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200/50 dark:border-amber-800/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-500 rounded-xl">
            <Home className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-amber-900 dark:text-amber-100">Property Reservation</h3>
            <p className="text-xs text-amber-700 dark:text-amber-300">{property?.title}</p>
          </div>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-amber-200/50 dark:border-amber-800/30">
          <span className="text-amber-800 dark:text-amber-200 font-medium">Deposit Amount</span>
          <span className="text-2xl font-bold text-amber-900 dark:text-amber-100">
            ${(DEPOSIT_AMOUNT / 100).toLocaleString()}
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
            options={{
              layout: 'tabs',
            }}
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
        className="w-full h-14 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-300"
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
          `Pay $${(DEPOSIT_AMOUNT / 100).toLocaleString()} Deposit`
        )}
      </Button>

      <div className="flex items-center justify-center gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-1">
          <Shield className="h-3 w-3" />
          <span>Protected by Stripe</span>
        </div>
        <span>•</span>
        <span>256-bit SSL Encryption</span>
      </div>
    </form>
  )
}

function SuccessState({ property }: { property: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30"
      >
        <CheckCircle2 className="h-10 w-10 text-white" />
      </motion.div>
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Reservation Confirmed!</h2>
      <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-md mx-auto">
        Your deposit for <strong>{property?.title}</strong> has been successfully processed. 
        The property is now reserved for you.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild className="bg-indigo-600 hover:bg-indigo-700 rounded-xl h-12 px-8">
          <Link href="/dashboard">View Dashboard</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-xl h-12 px-8">
          <Link href="/browse">Continue Browsing</Link>
        </Button>
      </div>
    </motion.div>
  )
}

export default function DepositCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-amber-50/30 to-orange-50/20 dark:from-black dark:via-zinc-900 dark:to-zinc-900 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-amber-600" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const propertyId = searchParams.get('propertyId')
  
  const [property, setProperty] = useState<any>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState('')
  const [paymentIntentId, setPaymentIntentId] = useState('')
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      if (!propertyId) {
        setError('No property selected')
        setLoading(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push(`/auth?redirect=/checkout?propertyId=${propertyId}`)
        return
      }
      setUserId(user.id)

      const { data: prop } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single()

      if (!prop) {
        setError('Property not found')
        setLoading(false)
        return
      }
      setProperty(prop)

      const res = await fetch('/api/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'deposit', propertyId, userId: user.id }),
      })

      const data = await res.json()
      if (data.error) {
        setError(data.error)
        setLoading(false)
        return
      }

      setClientSecret(data.clientSecret)
      setPaymentIntentId(data.paymentIntentId)
      setLoading(false)
    }

    init()
  }, [propertyId, router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-amber-50/30 to-orange-50/20 dark:from-black dark:via-zinc-900 dark:to-zinc-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-10 w-10 animate-spin text-amber-600" />
          <p className="text-zinc-600 dark:text-zinc-400">Preparing checkout...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-amber-50/30 to-orange-50/20 dark:from-black dark:via-zinc-900 dark:to-zinc-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Something went wrong</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">{error}</p>
          <Button asChild className="rounded-xl">
            <Link href="/browse">Back to Properties</Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  const stripePromise = getStripe()
  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#f59e0b',
      colorBackground: '#ffffff',
      borderRadius: '12px',
      fontFamily: 'system-ui, sans-serif',
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-amber-50/30 to-orange-50/20 dark:from-black dark:via-zinc-900 dark:to-zinc-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200/30 dark:bg-amber-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/30 dark:bg-orange-900/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 relative">
        <Button
          variant="ghost"
          className="mb-8 gap-2 text-zinc-600 hover:text-zinc-900"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50"
          >
            {success ? (
              <SuccessState property={property} />
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
                    Reserve Property
                  </h1>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Secure this property with a refundable deposit
                  </p>
                </div>

                {clientSecret && userId && (
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                    <DepositCheckoutForm
                      propertyId={propertyId!}
                      property={property}
                      userId={userId}
                      clientSecret={clientSecret}
                      paymentIntentId={paymentIntentId}
                      onSuccess={() => setSuccess(true)}
                    />
                  </Elements>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
