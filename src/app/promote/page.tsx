'use client'
import { SUBSCRIPTION_PRICES } from '@/lib/stripe'
import { loadStripe } from '@stripe/stripe-js'

import { useState, useEffect, Suspense } from 'react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Shield,
  Lock,
  Sparkles,
  ArrowLeft,
  Check,
  Zap,
  Crown,
  Rocket,
} from 'lucide-react'
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

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

/* ================= FORM ================= */

function PromoteCheckoutForm({
  tier,
  userId,
  clientSecret,
  paymentIntentId,
  onSuccess,
}: {
  tier: Tier
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
    if (!stripe || !elements) return

    setLoading(true)
    setError('')

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message || 'Validation failed')
      setLoading(false)
      return
    }

    const { error: paymentError, paymentIntent } =
      await stripe.confirmPayment({
        elements,
        clientSecret,
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
        body: JSON.stringify({ paymentIntentId }),
      })

      onSuccess()
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-6 rounded-2xl border">
        <h3 className="font-bold mb-2">{priceData.name}</h3>

        <ul className="space-y-2">
          {priceData.features.map((f, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-4 text-xl font-bold">
          ${(priceData.amount / 100).toLocaleString()}
        </div>
      </div>

      <PaymentElement onReady={() => setIsReady(true)} />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button disabled={!stripe || loading || !isReady}>
        {loading ? 'Processing...' : 'Pay'}
      </Button>
    </form>
  )
}

/* ================= PAGE ================= */

function PromotePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const tierParam = searchParams.get('tier') as Tier | null
  const propertyId = searchParams.get('propertyId')

  const supabase = createClient()

  const [userId, setUserId] = useState<string | null>(null)
  const [selectedTier, setSelectedTier] = useState<Tier>(
    tierParam || 'pro'
  )

  const [clientSecret, setClientSecret] = useState('')
  const [paymentIntentId, setPaymentIntentId] = useState('')
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [showPayment, setShowPayment] = useState(!!tierParam)

  /* ===== FIXED AUTH ===== */
  useEffect(() => {
    const init = async () => {
      if (!supabase) return

      const { data, error } = await supabase.auth.getUser()

      if (error || !data?.user) {
        router.push('/auth')
        return
      }

      setUserId(data.user.id)
      setLoading(false)
    }

    init()
  }, [supabase, router])

  /* ===== CREATE PAYMENT ===== */
  const createPaymentIntent = async (tier: Tier) => {
    if (!userId) return

    setLoading(true)
    setError('')

    const res = await fetch('/api/payment-intent', {
      method: 'POST',
      body: JSON.stringify({
        type: 'subscription',
        tier,
        propertyId,
        userId,
      }),
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
    return <Loader2 className="animate-spin m-auto mt-20" />
  }

  if (success) {
    return <div className="text-center mt-20">Success 🎉</div>
  }

  return (
    <div className="p-6">
      {!showPayment ? (
        <div className="grid md:grid-cols-3 gap-6">
          {(Object.keys(SUBSCRIPTION_PRICES) as Tier[]).map(
            (tier) => {
              const priceData = SUBSCRIPTION_PRICES[tier]

              return (
                <div key={tier} className="border p-6 rounded-xl">
                  <h2 className="font-bold">{priceData.name}</h2>

                  <ul className="my-4">
                    {priceData.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => createPaymentIntent(tier)}
                  >
                    Choose
                  </Button>
                </div>
              )
            }
          )}
        </div>
      ) : (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PromoteCheckoutForm
            tier={selectedTier}
            userId={userId!}
            clientSecret={clientSecret}
            paymentIntentId={paymentIntentId}
            onSuccess={() => setSuccess(true)}
          />
        </Elements>
      )}
    </div>
  )
}

export default function PromotePage() {
  return (
    <Suspense fallback={<Loader2 className="animate-spin m-auto mt-20" />}>
      <PromotePageContent />
    </Suspense>
  )
}