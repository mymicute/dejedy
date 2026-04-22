import Stripe from "stripe"
export const SUBSCRIPTION_PRICES = {
  basic: { amount: 1000, name: "Basic Plan" },
  premium: { amount: 5000, name: "Premium Plan" },
}