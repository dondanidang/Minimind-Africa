'use client'

import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, getPriceForQuantity, getDisplayPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'

export function OrderSummary() {
  const items = useCartStore(state => state.items)
  const total = useCartStore(state => state.getTotal())

  // Calculate original total (without discounts) and savings
  const originalTotal = items.reduce((sum, item) => {
    if (!item.product) return sum
    const product = item.product
    // For bundles, calculate original price (individual item prices)
    if (item.is_bundle && item.bundle_price !== undefined) {
      let bundleOriginalPrice = 0
      if (item.bundle_variant_selections && product.variants) {
        // Sum up individual variant prices
        const variantPrices = item.bundle_variant_selections.map(selection => {
          if (selection.variant_id) {
            const variant = product.variants?.find(v => v.id === selection.variant_id)
            if (variant && variant.price !== null) {
              return variant.price
            }
          }
          // Use product price if variant price is null or variant not found
          return getDisplayPrice(product)
        })
        bundleOriginalPrice = variantPrices.reduce((sum, price) => sum + price, 0)
      } else {
        // No variants, use product price * bundle_quantity
        bundleOriginalPrice = getDisplayPrice(product) * (item.bundle_quantity || 1)
      }
      return sum + bundleOriginalPrice * item.quantity
    }
    // For regular items, use variant price if available, otherwise product price
    const basePrice = item.variant && item.variant.price !== null 
      ? item.variant.price 
      : getDisplayPrice(product)
    return sum + basePrice * item.quantity
  }, 0)

  const savings = originalTotal - total

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Résumé de la commande</h2>
      
      <div className="space-y-4 mb-6">
        {items.map((item, index) => {
          if (!item.product) return null
          const imageUrl = item.product.images?.[0] || '/placeholder-product.jpg'
          
          const product = item.product
          // Handle bundle items
          let subtotal: number
          let originalPrice: number | null = null
          let productDisplayName: string
          let variantInfo: string | null = null
          
          if (item.is_bundle && item.bundle_price !== undefined) {
            subtotal = item.bundle_price * item.quantity
            
            // Calculate original price (what it would cost without bundle discount)
            if (item.bundle_variant_selections && product.variants) {
              // Sum up individual variant prices
              const variantPrices = item.bundle_variant_selections.map(selection => {
                if (selection.variant_id) {
                  const variant = product.variants?.find(v => v.id === selection.variant_id)
                  if (variant && variant.price !== null) {
                    return variant.price
                  }
                }
                // Use product price if variant price is null or variant not found
                return getDisplayPrice(product)
              })
              originalPrice = variantPrices.reduce((sum, price) => sum + price, 0)
            } else {
              // No variants, use product price * bundle_quantity
              originalPrice = getDisplayPrice(product) * (item.bundle_quantity || 1)
            }
            
            productDisplayName = product.name
            if (item.bundle_quantity) {
              productDisplayName += ` (Pack de ${item.bundle_quantity})`
            }
            if (item.bundle_variant_selections && item.bundle_variant_selections.length > 0) {
              variantInfo = item.bundle_variant_selections.map(s => s.variant_name).join(', ')
            }
          } else {
            // Handle regular items
            subtotal = getPriceForQuantity(product, item.quantity, item.variant || null)
            productDisplayName = product.name
            if (item.variant) {
              variantInfo = item.variant.name
            }
          }
          
          return (
            <div key={`${item.product_id}-${item.is_bundle ? 'bundle' : item.variant_id || 'none'}-${index}`} className="flex items-center space-x-4">
              <div className="relative w-16 h-16 overflow-hidden rounded-md bg-gray-100 flex-shrink-0">
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{productDisplayName}</p>
                {variantInfo && (
                  <p className="text-xs text-gray-500">Option: {variantInfo}</p>
                )}
                <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
              </div>
              <p className="font-semibold">
                {formatPrice(subtotal)}
              </p>
            </div>
          )
        })}
      </div>
      
      <div className="space-y-2 border-t pt-4">
        {savings > 0 && (
          <div className="flex justify-between text-gray-700 mb-2">
            <span className="font-medium">Sous-total original</span>
            <span className="line-through text-gray-400">{formatPrice(originalTotal)}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-700">
          <span>Sous-total</span>
          <span>{formatPrice(total)}</span>
        </div>
        {savings > 0 && (
          <div className="flex justify-between text-green-600 font-semibold">
            <span>Vous économisez</span>
            <span>{formatPrice(savings)}</span>
          </div>
        )}
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

