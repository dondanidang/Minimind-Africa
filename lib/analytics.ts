// Utility functions for Facebook Pixel events

export function trackAddToCart(product: { name: string; price: number }, quantity: number = 1) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_name: product.name,
      content_type: 'product',
      value: product.price,
      currency: 'XOF',
      num_items: quantity,
    })
  }
}

export function trackPurchase(order: { total: number; order_number: string }, items: Array<{ name: string; price: number; quantity: number }>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', {
      value: order.total,
      currency: 'XOF',
      content_type: 'product',
      contents: items.map(item => ({
        id: item.name,
        quantity: item.quantity,
        item_price: item.price,
      })),
      order_id: order.order_number,
    })
  }
}

export function trackInitiateCheckout(value: number, currency: string = 'XOF') {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      value,
      currency,
    })
  }
}

export function trackInitiatePayment(value: number, currency: string = 'XOF', orderId?: string) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiatePayment', {
      value,
      currency,
      ...(orderId && { content_name: orderId }),
    })
  }
}

export function trackViewContent(product: { name: string; price: number; id?: string }, currency: string = 'XOF') {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: product.name,
      content_type: 'product',
      content_ids: product.id ? [product.id] : undefined,
      value: product.price,
      currency,
    })
  }
}

declare global {
  interface Window {
    fbq: (...args: any[]) => void
  }
}

