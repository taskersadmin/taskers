import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

export const PRICE_IDS = {
  MINUTES_30: process.env.PRICE_75_30!,
  MINUTES_60: process.env.PRICE_125_60!,
  ADD_TIME_30: process.env.PRICE_50_ADD30!,
};

export function getPriceIdForService(serviceType: string): string {
  switch (serviceType) {
    case 'MINUTES_30':
      return PRICE_IDS.MINUTES_30;
    case 'MINUTES_60':
      return PRICE_IDS.MINUTES_60;
    case 'ADD_TIME_30':
      return PRICE_IDS.ADD_TIME_30;
    default:
      throw new Error(`Unknown service type: ${serviceType}`);
  }
}

export function getServiceDurationSeconds(serviceType: string): number {
  switch (serviceType) {
    case 'MINUTES_30':
    case 'ADD_TIME_30':
      return 30 * 60;
    case 'MINUTES_60':
      return 60 * 60;
    default:
      return 30 * 60;
  }
}
