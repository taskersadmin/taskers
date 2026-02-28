const BLOCKED_KEYWORDS = [
  'cash', 'tip', 'venmo', 'zelle', 'cashapp', 'paypal',
  'pay you', 'pay directly', 'refund', 'discount',
  'price change', 'lower the price', 'chargeback'
]

export function filterMessage(text: string): { filtered: boolean; text: string } {
  const lowerText = text.toLowerCase()
  const hasBlocked = BLOCKED_KEYWORDS.some(keyword => lowerText.includes(keyword))
  
  if (hasBlocked) {
    return {
      filtered: true,
      text: "For safety, pricing and payments are handled only in the app. Please contact support."
    }
  }
  
  return { filtered: false, text }
}
