import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export const PRICE_IDS = {
  MINUTES_30: process.env.PRICE_75_30!,
  MINUTES_60: process.env.PRICE_125_60!,
  ADD_30: process.env.PRICE_50_ADD30!,
}

export const PRICE_MAP: Record<string, { amount: number; duration: number }> = {
  [PRICE_IDS.MINUTES_30]: { amount: 7500, duration: 1800 }, // $75, 30min
  [PRICE_IDS.MINUTES_60]: { amount: 12500, duration: 3600 }, // $125, 60min
  [PRICE_IDS.ADD_30]: { amount: 5000, duration: 1800 }, // $50, 30min
}
