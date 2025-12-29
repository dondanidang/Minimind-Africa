export type Order = {
  id: string
  order_number: string
  user_id: string | null
  customer_email: string
  customer_name: string | null
  customer_phone: string | null
  shipping_address: Record<string, any> | null
  payment_data: {
    payment_link_url?: string
    payment_link_id?: string
    webhooks?: Array<Record<string, any>>
  } | null
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_method: string | null
  payment_status: string
  created_at: string
  updated_at: string
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  product_price: number
  quantity: number
  created_at: string
}

