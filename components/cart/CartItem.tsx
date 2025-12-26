'use client'

import Image from 'next/image'
import Link from 'next/link'
import { QuantitySelector } from '@/components/product/QuantitySelector'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import type { CartItem as CartItemType } from '@/types/cart'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore(state => state.updateQuantity)
  const removeItem = useCartStore(state => state.removeItem)
  
  if (!item.product) return null

  const imageUrl = item.product.images?.[0] || '/placeholder-product.jpg'
  const subtotal = item.product.price * item.quantity

  return (
    <div className="flex items-center space-x-4 py-4 border-b">
      <Link href={`/products/${item.product.slug}`} className="flex-shrink-0">
        <div className="relative w-24 h-24 overflow-hidden rounded-md bg-gray-100">
          <Image
            src={imageUrl}
            alt={item.product.name}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      
      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.product.slug}`}>
          <h3 className="font-semibold text-lg hover:text-primary-600">
            {item.product.name}
          </h3>
        </Link>
        <p className="text-primary-600 font-semibold mt-1">
          {formatPrice(item.product.price)}
        </p>
      </div>
      
      <div className="flex items-center space-x-4">
        <QuantitySelector
          quantity={item.quantity}
          onQuantityChange={(newQuantity) => updateQuantity(item.product_id, newQuantity)}
          max={item.product.stock}
        />
        
        <div className="w-32 text-right">
          <p className="font-semibold text-lg">
            {formatPrice(subtotal)}
          </p>
        </div>
        
        <button
          onClick={() => removeItem(item.product_id)}
          className="text-gray-400 hover:text-red-600 transition-colors"
          aria-label="Supprimer"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

