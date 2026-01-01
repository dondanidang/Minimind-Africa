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

