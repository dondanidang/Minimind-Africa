import { Product } from './product'

export type CartItem = {
  id?: string
  product_id: string
  quantity: number
  product?: Product
}

export type Cart = {
  items: CartItem[]
  total: number
}

