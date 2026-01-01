import type { ProductPageContent } from './productPageContent'

export type BundlePrice = {
  quantity: number
  price: number
}

export type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  promo_price?: number | null
  bundle_pricing?: BundlePrice[] | null
  images: string[]
  stock: number
  featured: boolean
  created_at: string
  updated_at: string
  page_content?: ProductPageContent | null
}

export type ProductVariant = {
  id: string
  product_id: string
  name: string
  price: number | null
  stock: number
  created_at: string
}

export type ProductWithVariants = Product & {
  variants?: ProductVariant[]
}

