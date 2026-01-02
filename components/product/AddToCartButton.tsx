'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/store/cartStore'
import { trackAddToCart } from '@/lib/analytics'
import { getPriceForQuantity } from '@/lib/utils'
import type { Product } from '@/types/product'

interface AddToCartButtonProps {
  product: Product
  quantity?: number
  className?: string
}

export function AddToCartButton({ product, quantity = 1, className }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const router = useRouter()
  const addItem = useCartStore(state => state.addItem)

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      addItem(product, quantity)
      // Track Facebook Pixel AddToCart event
      const totalPrice = getPriceForQuantity(product, quantity)
      trackAddToCart({ name: product.name, price: totalPrice }, quantity)
      // Optional: Show a toast notification here
      // For now, just add to cart
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  if (product.stock === 0) {
    return (
      <Button disabled className={className}>
        Épuisé
      </Button>
    )
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdding}
      variant="outline"
      className={`${className} border-2 border-black bg-white text-black hover:bg-gray-50`}
    >
      {isAdding ? 'Ajout en cours...' : 'Ajouter au panier'}
    </Button>
  )
}

