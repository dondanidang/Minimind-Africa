'use client'

import { CartItem } from '@/components/cart/CartItem'
import { CartSummary } from '@/components/cart/CartSummary'
import { CartEmpty } from '@/components/cart/CartEmpty'
import { useCartStore } from '@/store/cartStore'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/types/product'

export default function CartPage() {
  const items = useCartStore(state => state.items)
  const [products, setProducts] = useState<Record<string, Product>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      const supabase = createClient()
      const productIds = items.map(item => item.product_id)
      
      if (productIds.length === 0) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds)

      if (data) {
        const productsMap: Record<string, Product> = {}
        data.forEach(product => {
          productsMap[product.id] = product as Product
        })
        setProducts(productsMap)
      }
      setLoading(false)
    }

    fetchProducts()
  }, [items])

  // Enrich cart items with product data
  const enrichedItems = items.map(item => ({
    ...item,
    product: item.product || products[item.product_id],
  }))

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Chargement...</div>
      </div>
    )
  }

  if (enrichedItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <CartEmpty />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Panier</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {enrichedItems.map((item) => (
              <CartItem key={item.product_id} item={item} />
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>
    </div>
  )
}

