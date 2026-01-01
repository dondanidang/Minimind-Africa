'use client'

import { formatPrice } from '@/lib/utils'
import type { BundlePrice } from '@/types/product'

interface ProductBundlePricingProps {
  bundlePricing: BundlePrice[]
  regularPrice: number
  selectedQuantity: number
  onQuantitySelect: (quantity: number) => void
  maxQuantity?: number
}

export function ProductBundlePricing({
  bundlePricing,
  regularPrice,
  selectedQuantity,
  onQuantitySelect,
  maxQuantity,
}: ProductBundlePricingProps) {
  // Sort bundles by quantity
  const sortedBundles = [...bundlePricing].sort((a, b) => a.quantity - b.quantity)

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">Offres groupées disponibles</h3>
      <div className="grid grid-cols-1 gap-3">
        {sortedBundles.map((bundle) => {
          const isSelected = selectedQuantity === bundle.quantity
          const regularTotal = regularPrice * bundle.quantity
          const savings = regularTotal - bundle.price
          const savingsPercent = Math.round((savings / regularTotal) * 100)
          const isDisabled = maxQuantity ? bundle.quantity > maxQuantity : false

          return (
            <button
              key={bundle.quantity}
              onClick={() => !isDisabled && onQuantitySelect(bundle.quantity)}
              disabled={isDisabled}
              className={`
                relative p-4 rounded-lg border-2 text-left transition-all
                ${isSelected
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg">
                      {bundle.quantity} {bundle.quantity === 1 ? 'produit' : 'produits'}
                    </span>
                    {savings > 0 && (
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                        -{savingsPercent}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-primary-600">
                      {formatPrice(bundle.price)}
                    </span>
                    {savings > 0 && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(regularTotal)}
                      </span>
                    )}
                  </div>
                  {savings > 0 && (
                    <p className="text-xs text-green-600 mt-1">
                      Vous économisez {formatPrice(savings)}
                    </p>
                  )}
                </div>
                {isSelected && (
                  <div className="ml-4 w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

