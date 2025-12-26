'use client'

import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'

export function OrderSummary() {
  const items = useCartStore(state => state.items)
  const total = useCartStore(state => state.getTotal())

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Résumé de la commande</h2>
      
      <div className="space-y-4 mb-6">
        {items.map((item) => {
          if (!item.product) return null
          const imageUrl = item.product.images?.[0] || '/placeholder-product.jpg'
          
          return (
            <div key={item.product_id} className="flex items-center space-x-4">
              <div className="relative w-16 h-16 overflow-hidden rounded-md bg-gray-100 flex-shrink-0">
                <Image
                  src={imageUrl}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{item.product.name}</p>
                <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
              </div>
              <p className="font-semibold">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
          )
        })}
      </div>
      
      <div className="space-y-2 border-t pt-4">
        <div className="flex justify-between text-gray-700">
          <span>Sous-total</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Livraison</span>
          <span className="text-green-600">Gratuite</span>
        </div>
        <div className="flex justify-between text-xl font-bold pt-2 border-t">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  )
}

