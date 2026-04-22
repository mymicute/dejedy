import { NextRequest, NextResponse } from 'next/server'
import { stripe, DEPOSIT_AMOUNT, SUBSCRIPTION_PRICES } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, propertyId, userId, tier } = body

    if (!type || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let amount: number
    let description: string
    let metadata: Record<string, string> = { user_id: userId, type }

    if (type === 'deposit') {
      if (!propertyId) {
        return NextResponse.json(
          { error: 'Property ID required for deposits' },
          { status: 400 }
        )
      }

      const { data: property } = await supabaseAdmin
        .from('properties')
        .select('title, price')
        .eq('id', propertyId)
        .single()

      if (!property) {
        return NextResponse.json({ error: 'Property not found' }, { status: 404 })
      }

      amount = DEPOSIT_AMOUNT
      description = `Reservation deposit for: ${property.title}`
      metadata.property_id = propertyId
    } else if (type === 'subscription') {
      const priceData = SUBSCRIPTION_PRICES[tier as keyof typeof SUBSCRIPTION_PRICES]
      if (!priceData) {
        return NextResponse.json({ error: 'Invalid subscription tier' }, { status: 400 })
      }
      amount = priceData.amount
      description = `${priceData.name} - Promoted Listing`
      metadata.tier = tier
      if (propertyId) metadata.property_id = propertyId
    } else {
      return NextResponse.json({ error: 'Invalid payment type' }, { status: 400 })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'ngn',
      automatic_payment_methods: { enabled: true },
      metadata,
      description,
    })

    const { error: txError } = await supabaseAdmin.from('transactions').insert({
      user_id: userId,
      property_id: propertyId || null,
      type,
      stripe_payment_intent_id: paymentIntent.id,
      amount,
      status: 'pending',
      description,
      metadata,
    })

    if (txError) {
      console.error('Transaction insert error:', txError)
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount,
    })
  } catch (error: any) {
    console.error('Payment intent error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
