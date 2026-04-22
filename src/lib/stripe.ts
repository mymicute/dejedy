import Stripe from "stripe"
export type SubscriptionPrice = {
  amount: number
  name: string
}
export const SUBSCRIPTION_PRICES = {
  basic: { amount: 1000, name: "Basic Plan" },
  pro: { amount: 5000, name: "Pro Plan" },
  premium: { amount: 10000, name: "Premium Plan" }
}