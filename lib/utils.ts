import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency: string = 'XOF'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(price)
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function getDisplayPrice(product: { price: number; promo_price?: number | null }): number {
  return product.promo_price && product.promo_price < product.price 
    ? product.promo_price 
    : product.price
}

export function getOriginalPrice(product: { price: number; promo_price?: number | null }): number {
  return product.price
}

export function getDiscountPercentage(product: { price: number; promo_price?: number | null }): number | null {
  if (!product.promo_price || product.promo_price >= product.price) return null
  const discount = ((product.price - product.promo_price) / product.price) * 100
  return Math.round(discount)
}

export function getBundlePrice(
  bundlePricing: Array<{ quantity: number; price: number }> | null | undefined,
  quantity: number
): number | null {
  if (!bundlePricing || bundlePricing.length === 0) return null
  
  // Find exact match for quantity
  const bundle = bundlePricing.find(b => b.quantity === quantity)
  return bundle ? bundle.price : null
}

export function getPriceForQuantity(
  product: { price: number; promo_price?: number | null; bundle_pricing?: Array<{ quantity: number; price: number }> | null },
  quantity: number,
  variant?: { price: number | null } | null
): number {
  // Use variant price if provided and not null
  const basePrice = variant && variant.price !== null 
    ? variant.price 
    : getDisplayPrice(product)
  
  // Check bundle pricing first (bundle pricing applies to total quantity, not per-variant)
  const bundlePrice = getBundlePrice(product.bundle_pricing, quantity)
  if (bundlePrice !== null) {
    return bundlePrice
  }
  
  // Fall back to variant or product price
  return basePrice * quantity
}

export function calculateBundleSavings(
  bundlePricing: Array<{ quantity: number; price: number }> | null | undefined,
  quantity: number,
  regularPrice: number
): number | null {
  const bundlePrice = getBundlePrice(bundlePricing, quantity)
  if (bundlePrice === null) return null
  
  const regularTotal = regularPrice * quantity
  return regularTotal - bundlePrice
}

