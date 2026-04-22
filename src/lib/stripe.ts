import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export const DEPOSIT_AMOUNT = 1000

export const SUBSCRIPTION_PRICES = {
  basic: 1000,
  premium: 5000,
}