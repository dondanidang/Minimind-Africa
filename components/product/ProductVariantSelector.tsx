'use client'

import { formatPrice } from '@/lib/utils'
import type { ProductVariant } from '@/types/product'

interface ProductVariantSelectorProps {
  variants: ProductVariant[]
  selectedVariantId: string | null
  onVariantChange: (variantId: string | null) => void
  basePrice: number
  horizontal?: boolean
}

export function ProductVariantSelector({
  variants,
  selectedVariantId,
  onVariantChange,
  basePrice,
  horizontal = false,
}: ProductVariantSelectorProps) {
  if (!variants || variants.length === 0) {
    return null
  }

  if (horizontal) {
    // Premium horizontal layout - inspired by Allbirds/Apple
    return (
      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => {
          const isSelected = selectedVariantId === variant.id
          const isOutOfStock = variant.stock === 0

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => !isOutOfStock && onVariantChange(variant.id)}
              disabled={isOutOfStock}
              className={`
                relative px-4 py-2.5 rounded-lg border-2 transition-all text-sm font-medium
                ${isSelected
                  ? 'border-primary-600 bg-primary-100 text-primary-700 ring-2 ring-primary-200'
                  : 'border-gray-300 hover:border-gray-400 bg-white text-gray-900'
                }
                ${isOutOfStock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
              `}
              title={isOutOfStock ? 'Épuisé' : variant.name}
            >
              <div className="flex items-center gap-2">
                <span className={isSelected ? 'font-semibold' : ''}>{variant.name}</span>
                {isSelected && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          )
        })}
      </div>
    )
  }

  // Vertical layout - for bundles
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Choisir une option
      </label>
      <div className="space-y-2">
        {variants.map((variant) => {
          const isSelected = selectedVariantId === variant.id
          const isOutOfStock = variant.stock === 0
          const displayPrice = variant.price !== null ? variant.price : basePrice

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => !isOutOfStock && onVariantChange(variant.id)}
              disabled={isOutOfStock}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              } ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${isSelected ? 'text-primary-600' : 'text-gray-900'}`}>
                      {variant.name}
                    </span>
                    {isSelected && (
                      <span className="px-2 py-0.5 bg-primary-600 text-white text-xs font-medium rounded-full">
                        Sélectionné
                      </span>
                    )}
                    {isOutOfStock && (
                      <span className="text-red-600 font-medium text-sm">Épuisé</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                    <span>{formatPrice(displayPrice)}</span>
                    {variant.price !== null && variant.price !== basePrice && (
                      <span className="text-xs text-gray-500">
                        (Prix de base: {formatPrice(basePrice)})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

