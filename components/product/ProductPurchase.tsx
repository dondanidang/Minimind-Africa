'use client'

import { useState } from 'react'
import { QuantitySelector } from './QuantitySelector'
import { AddToCartButton } from './AddToCartButton'
import type { Product } from '@/types/product'

interface ProductPurchaseProps {
  product: Product
}

export function ProductPurchase({ product }: ProductPurchaseProps) {
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="flex items-end space-x-4 pt-4">
      <div>
        <label className="block text-sm font-medium mb-2">Quantité</label>
        <QuantitySelector
          quantity={quantity}
          onQuantityChange={setQuantity}
          max={product.stock}
          disabled={product.stock === 0}
        />
      </div>
      <div className="flex-1">
        <AddToCartButton product={product} quantity={quantity} className="w-full" />
      </div>
    </div>
  )
}

