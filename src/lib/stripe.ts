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
    name: 'Basic Plan',
  },
  pro: {
    amount: 5000,
    name: 'Pro Plan',
  },
  premium: {
    amount: 10000,
    name: 'Premium Plan',
  },
} as const