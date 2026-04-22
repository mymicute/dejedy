import Stripe from 'stripe'

/**
 * Stripe instance (server-side only)
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

/**
 * Deposit amount (in smallest currency unit: kobo for NGN, cents for USD, etc.)
 */
export const DEPOSIT_AMOUNT = 5000

/**
 * Subscription pricing structure
 * IMPORTANT: must be objects (NOT numbers) because your API uses .amount and .name
 */
export const SUBSCRIPTION_PRICES = {
  basic: {
    amount: 1000,
    name: "Basic Plan",
    features: [
      "1 Property Listing",
      "Basic Visibility",
      "Email Support"
    ]
  },
  pro: {
    amount: 5000,
    name: "Pro Plan",
    features: [
      "5 Property Listings",
      "Featured Listing",
      "Priority Support",
      "Higher Visibility"
    ]
  },
  premium: {
    amount: 10000,
    name: "Premium Plan",
    features: [
      "Unlimited Listings",
      "Top Featured Placement",
      "24/7 Support",
      "Maximum Visibility",
      "Analytics Dashboard"
    ]
  }
} as const