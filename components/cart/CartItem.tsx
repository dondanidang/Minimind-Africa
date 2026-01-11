'use client'

import Image from 'next/image'
import Link from 'next/link'
import { QuantitySelector } from '@/components/product/QuantitySelector'
gstimport { formatPrice, getPriceForQuantity, getDisplayPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import type { CartItem as CartItemType } from '@/types/cart'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore(state => state.updateQuantity)
  const updateBundleQuantity = useCartStore(state => state.updateBundleQuantity)
  const removeItem = useCartStore(state => state.removeItem)
  const removeBundle = useCartStore(state => state.removeBundle)
  
  if (!item.product) return null

  const product = item.product
  const imageUrl = product.images?.[0] || '/placeholder-product.jpg'
  
  // Handle bundle items
  if (item.is_bundle && item.bundle_price !== undefined) {
    const subtotal = item.bundle_price * item.quantity
    const unitPrice = item.bundle_price
    
    // Calculate original price (what it would cost without bundle discount)
    let originalUnitPrice: number | null = null
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
      originalUnitPrice = variantPrices.reduce((sum, price) => sum + price, 0)
    } else {
      // No variants, use product price * bundle_quantity
      originalUnitPrice = getDisplayPrice(product) * (item.bundle_quantity || 1)
    }
    
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
          <p className="text-sm text-gray-600 mt-1">
            Pack de {item.bundle_quantity || 0} produits
          </p>
          {item.bundle_variant_selections && item.bundle_variant_selections.length > 0 && (
            <div className="mt-2 space-y-1">
              {item.bundle_variant_selections.map((selection, index) => (
                <p key={index} className="text-xs text-gray-500">
                  • {selection.variant_name}
                </p>
              ))}
            </div>
          )}
          <div className="mt-2">
            {originalUnitPrice !== null && originalUnitPrice > unitPrice && (
              <p className="text-sm text-gray-400 line-through">
                {formatPrice(originalUnitPrice)}
              </p>
            )}
            <p className="text-primary-600 font-semibold">
              {formatPrice(unitPrice)}
            </p>
            {originalUnitPrice !== null && originalUnitPrice > unitPrice && (
              <p className="text-xs text-green-600 mt-1">
                Économisez {formatPrice(originalUnitPrice - unitPrice)}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <QuantitySelector
            quantity={item.quantity}
            onQuantityChange={(newQuantity) => updateBundleQuantity(item.product_id, newQuantity, item.bundle_quantity, item.bundle_variant_selections)}
            max={999}
          />
          
          <div className="w-32 text-right">
            {originalUnitPrice !== null && originalUnitPrice > unitPrice && (
              <p className="text-sm text-gray-400 line-through mb-1">
                {formatPrice(originalUnitPrice * item.quantity)}
              </p>
            )}
            <p className="font-semibold text-lg">
              {formatPrice(subtotal)}
            </p>
          </div>
          
          <button
            onClick={() => removeBundle(item.product_id, item.bundle_quantity, item.bundle_variant_selections)}
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
  
  // Handle regular items
  const subtotal = getPriceForQuantity(product, item.quantity, item.variant || null)
  // Calculate unit price for display (subtotal / quantity)
  const unitPrice = subtotal / item.quantity
  const effectiveStock = item.variant ? item.variant.stock : product.stock

  return (
    <div className="flex items-center space-x-4 py-4 border-b">
      <Link href={`/products/${product.slug}`} className="flex-shrink-0">
        <div className="relative w-24 h-24 overflow-hidden rounded-md bg-gray-100">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      
      <div className="flex-1 min-w-0">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-lg hover:text-primary-600">
            {product.name}
          </h3>
        </Link>
        {item.variant && (
          <p className="text-sm text-gray-600 mt-1">
            Option: {item.variant.name}
          </p>
        )}
        <p className="text-primary-600 font-semibold mt-1">
          {formatPrice(unitPrice)}
        </p>
      </div>
      
      <div className="flex items-center space-x-4">
        <QuantitySelector
          quantity={item.quantity}
          onQuantityChange={(newQuantity) => updateQuantity(item.product_id, newQuantity, item.variant_id || null)}
          max={effectiveStock}
        />
        
        <div className="w-32 text-right">
          <p className="font-semibold text-lg">
            {formatPrice(subtotal)}
          </p>
        </div>
        
        <button
          onClick={() => removeItem(item.product_id, item.variant_id || null)}
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

