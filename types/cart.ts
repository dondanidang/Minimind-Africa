import { Product, ProductVariant } from './product'

export type CartItem = {
  id?: string
  product_id: string
  variant_id?: string | null
  quantity: number
  product?: Product
  variant?: ProductVariant
  // Bundle fields
  is_bundle?: boolean
  bundle_quantity?: number // Number of items in the bundle
  bundle_variant_selections?: Array<{ variant_id: string | null; variant_name: string }> // Variant selections for bundle items
  bundle_price?: number // Total bundle price
}

export type Cart = {
  items: CartItem[]
  total: number
}

