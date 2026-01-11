'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProductGallery } from './ProductGallery'
import { QuantitySelector } from './QuantitySelector'
import { AddToCartButton } from './AddToCartButton'
import { ProductVariantSelector } from './ProductVariantSelector'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/store/cartStore'
import { formatPrice, getDisplayPrice, getDiscountPercentage, getPriceForQuantity } from '@/lib/utils'
import { ProductBundlePricing } from './ProductBundlePricing'
import type { Product } from '@/types/product'
import type { Review } from '@/types/review'
import type { ProductPageContent } from '@/types/productPageContent'

interface ProductMainSectionProps {
  product: Product
  reviews?: Review[]
  pageContent?: ProductPageContent
}

export function ProductMainSection({ 
  product, 
  reviews = [],
  pageContent
}: ProductMainSectionProps) {
  const [quantity, setQuantity] = useState(1)
  // For bundles: track variant selection per item index
  const [bundleVariantSelections, setBundleVariantSelections] = useState<Array<string | null>>([])
  // For non-bundle: single variant selection
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  // Generate random number between 5 and 20 for FOMO urgency message
  // Start with a default value to avoid hydration mismatch, then set random on client
  const [urgencyCount, setUrgencyCount] = useState(10)
  
  // Set random number only on client side after hydration
  useEffect(() => {
    setUrgencyCount(Math.floor(Math.random() * (20 - 5 + 1)) + 5)
  }, [])
  
  const router = useRouter()
  const addItem = useCartStore(state => state.addItem)
  const addBundle = useCartStore(state => state.addBundle)
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0

  const mainFeatures = pageContent?.mainFeatures ?? []
  const whyThisGame = pageContent?.whyThisGame
  const variants = product.variants || []
  
  // Check if bundle pricing is available
  const hasBundlePricing = product.bundle_pricing && product.bundle_pricing.length > 0
  // Check if a bundle is selected (quantity matches a bundle offer)
  const isBundleSelected = hasBundlePricing && product.bundle_pricing?.some(b => b.quantity === quantity)
  
  // When bundle quantity changes, reset variant selections and auto-select first variant
  useEffect(() => {
    if (isBundleSelected && quantity > 0 && variants.length > 0) {
      // Clear standard variant selection when bundle is selected
      setSelectedVariantId(null)
      // Auto-select first available variant for each item, or first variant if all out of stock
      const firstVariant = variants.find(v => v.stock > 0) || variants[0]
      if (firstVariant) {
        setBundleVariantSelections(Array(quantity).fill(firstVariant.id))
      } else {
        setBundleVariantSelections(Array(quantity).fill(null))
      }
    } else if (isBundleSelected && quantity > 0) {
      // Clear standard variant selection when bundle is selected
      setSelectedVariantId(null)
      // No variants, just reset to array of nulls
      setBundleVariantSelections(Array(quantity).fill(null))
    }
  }, [quantity, isBundleSelected, variants])
  
  // When standard variant is selected, reset quantity to 1 (no bundle)
  const handleStandardVariantChange = (variantId: string | null) => {
    if (isBundleSelected) {
      // Reset quantity to 1 when selecting a standard variant (exits bundle mode)
      setQuantity(1)
      setBundleVariantSelections([])
    }
    setSelectedVariantId(variantId)
  }

  // Reset and select first variant when product changes or on mount
  useEffect(() => {
    // Reset selection when product changes
    setSelectedVariantId(null)
    
    // Select first variant by default (when no bundle is selected)
    // This applies to both products with and without bundle pricing
    if (!isBundleSelected && variants.length > 0) {
      const firstAvailableVariant = variants.find(v => v.stock > 0) || variants[0]
      if (firstAvailableVariant) {
        setSelectedVariantId(firstAvailableVariant.id)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id, variants.length, isBundleSelected])

  const selectedVariant = selectedVariantId ? variants.find(v => v.id === selectedVariantId) : null

  // Get effective price and stock (for display purposes)
  const effectivePrice = getDisplayPrice(product)
  const effectiveStock = product.stock

  const handleBundleVariantChange = (itemIndex: number, variantId: string | null) => {
    const newSelections = [...bundleVariantSelections]
    newSelections[itemIndex] = variantId
    setBundleVariantSelections(newSelections)
  }

  const handleAddToCartBundle = () => {
    // Validate all items have variants selected (if variants exist)
    if (variants.length > 0) {
      const missingVariants = bundleVariantSelections.some(sel => sel === null)
      if (missingVariants) {
        alert('Veuillez sélectionner une option pour chaque produit dans l\'offre groupée.')
        return
      }
    }
    
    // Calculate bundle total price
    const bundleTotal = getBundleTotal()
    
    // Build variant selections array with variant names
    const variantSelections = bundleVariantSelections.map((variantId) => {
      if (variantId) {
        const variant = variants.find(v => v.id === variantId)
        return {
          variant_id: variantId,
          variant_name: variant?.name || 'Unknown'
        }
      }
      return {
        variant_id: null,
        variant_name: 'Standard'
      }
    })
    
    // Add bundle as a single cart item
    addBundle(product, quantity, bundleTotal, variantSelections)
  }

  const handleBuyNowBundle = () => {
    // Validate all items have variants selected (if variants exist)
    if (variants.length > 0) {
      const missingVariants = bundleVariantSelections.some(sel => sel === null)
      if (missingVariants) {
        alert('Veuillez sélectionner une option pour chaque produit dans l\'offre groupée.')
        return
      }
    }
    
    // Calculate bundle total price
    const bundleTotal = getBundleTotal()
    
    // Build variant selections array with variant names
    const variantSelections = bundleVariantSelections.map((variantId) => {
      if (variantId) {
        const variant = variants.find(v => v.id === variantId)
        return {
          variant_id: variantId,
          variant_name: variant?.name || 'Unknown'
        }
      }
      return {
        variant_id: null,
        variant_name: 'Standard'
      }
    })
    
    // Add bundle as a single cart item
    addBundle(product, quantity, bundleTotal, variantSelections)
    
    router.push('/checkout')
  }

  const handleBuyNow = () => {
    // For non-bundle purchases
    if (variants.length > 0 && !selectedVariantId) {
      alert('Veuillez sélectionner une option avant de continuer.')
      return
    }
    addItem(product, quantity, selectedVariantId)
    router.push('/checkout')
  }

  // Calculate bundle total (using bundle price, not individual item prices)
  const getBundleTotal = () => {
    if (!isBundleSelected || !product.bundle_pricing) return 0
    const bundle = product.bundle_pricing.find(b => b.quantity === quantity)
    return bundle ? bundle.price : 0
  }

  // Check if all bundle variants are selected
  const allBundleVariantsSelected = variants.length === 0 || 
    (bundleVariantSelections.length === quantity && bundleVariantSelections.every(sel => sel !== null))

  // Calculate delivery date (example: 2 days from now)
  const getDeliveryDate = () => {
    const date = new Date()
    date.setDate(date.getDate() + 2)
    const days = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam']
    const months = ['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc']
    return `${days[date.getDay()]}. ${date.getDate()} ${months[date.getMonth()]}`
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image Gallery */}
        <ProductGallery images={product.images} productName={product.name} />
        
        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            {reviews.length > 0 && (
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(averageRating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {averageRating.toFixed(1)} ({reviews.length} avis)
                </span>
              </div>
            )}
            
            <div className="space-y-4">
              {/* Price Display */}
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-bold text-primary-600">
                  {formatPrice(
                    selectedVariant && selectedVariant.price !== null 
                      ? selectedVariant.price 
                      : getDisplayPrice(product)
                  )}
                </p>
                {product.promo_price && product.promo_price < product.price && (
                  <>
                    <p className="text-2xl text-gray-400 line-through">
                      {formatPrice(product.price)}
                    </p>
                    <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded">
                      Économisez {formatPrice(product.price - getDisplayPrice(product))}
                    </span>
                  </>
                )}
              </div>
              
              {/* Variant Selector - Premium Horizontal Layout with Separators */}
              {variants.length > 0 && (
                <div className="py-4 border-t border-b border-gray-200">
                  <ProductVariantSelector
                    variants={variants}
                    selectedVariantId={selectedVariantId}
                    onVariantChange={handleStandardVariantChange}
                    basePrice={getDisplayPrice(product)}
                    horizontal={true}
                  />
                  <p className="text-xs text-gray-500 mt-3">
                    Vous pouvez choisir une option ci-dessus
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Features Banner */}
          {mainFeatures.length > 0 && (
            <div className="flex flex-wrap gap-4 p-4 rounded-lg" style={{ backgroundColor: '#CCB5D9' }}>
              {mainFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="text-xl">{feature.icon}</span>
                  <span className="text-gray-900 font-medium">{feature.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Urgency Message - Styled as pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm" style={{ backgroundColor: '#F6F1BF' }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#CCB5D9' }}></div>
            <span className="text-gray-900 italic">
              Dépêchez vous! {urgencyCount} personnes regardent aussi ce produit!
            </span>
          </div>

          {product.description && (
            <div className="prose max-w-none">
              <div 
                className="text-gray-700"
                dangerouslySetInnerHTML={{ 
                  __html: product.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                }}
              />
            </div>
          )}

          {/* Why This Game Expandable Section */}
          {whyThisGame && whyThisGame.items && whyThisGame.items.length > 0 && (
            <div className="border rounded-lg">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 rounded-t-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600">?</span>
                  </div>
                  <span className="font-semibold text-gray-900 text-left">{whyThisGame.title || "Pourquoi ce jeu vaut mille fois plus qu'un jouet électronique"}</span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isExpanded && (
                <div className="px-4 pb-4 space-y-6 border-t">
                  {whyThisGame.items.map((item, index) => (
                    <div key={index} className="space-y-2 pt-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        {index + 1} – {item.title}
                      </h3>
                      <div 
                        className="prose prose-sm max-w-none text-gray-700"
                        dangerouslySetInnerHTML={{ 
                          __html: item.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bundle Pricing - Show First */}
          {hasBundlePricing ? (
            <div className="space-y-4">
              <ProductBundlePricing
                bundlePricing={product.bundle_pricing!}
                regularPrice={product.promo_price && product.promo_price < product.price 
                  ? product.promo_price 
                  : product.price}
                selectedQuantity={quantity}
                onQuantitySelect={setQuantity}
                maxQuantity={effectiveStock}
              />
              
              {/* Variant Selectors - Only show when bundle is selected */}
              {variants.length > 0 && isBundleSelected && (
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Choisir les options pour chaque produit ({quantity} {quantity === 1 ? 'produit' : 'produits'})
                  </h3>
                  {Array.from({ length: quantity }).map((_, index) => (
                    <div key={index} className="space-y-2">
                      <label className="block text-xs font-medium text-gray-600">
                        Produit {index + 1}:
                      </label>
                      <ProductVariantSelector
                        variants={variants}
                        selectedVariantId={bundleVariantSelections[index] || null}
                        onVariantChange={(variantId) => handleBundleVariantChange(index, variantId)}
                        basePrice={getDisplayPrice(product)}
                      />
                    </div>
                  ))}
                </div>
              )}
              
              {/* Bundle Total and Actions */}
              {isBundleSelected ? (
                <>
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Total:</span>
                      <span className="text-xl font-bold text-primary-600">
                        {formatPrice(getBundleTotal())}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Button
                        onClick={handleAddToCartBundle}
                        disabled={effectiveStock === 0 || (variants.length > 0 && !allBundleVariantsSelected)}
                        variant="outline"
                        className="w-full border-2 border-black bg-white text-black hover:bg-gray-50"
                      >
                        Ajouter au panier
                      </Button>
                    </div>
                    <Button
                      onClick={handleBuyNowBundle}
                      disabled={effectiveStock === 0 || (variants.length > 0 && !allBundleVariantsSelected)}
                      className="flex-1 bg-black text-white hover:bg-gray-800"
                    >
                      Acheter maintenant
                    </Button>
                  </div>
                </>
              ) : (
                /* Show standard purchase buttons when bundle pricing exists but no bundle selected */
                <div className="space-y-3 pt-4 border-t">
                  {/* Price Display */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Prix:</span>
                      <span className="text-xl font-bold text-primary-600">
                        {formatPrice(
                          selectedVariant && selectedVariant.price !== null 
                            ? selectedVariant.price 
                            : getDisplayPrice(product)
                        )}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <Button
                    onClick={handleBuyNow}
                    disabled={effectiveStock === 0 || (variants.length > 0 && !selectedVariantId)}
                    className="w-full bg-black text-white hover:bg-gray-800 text-lg py-3"
                  >
                    Acheter maintenant
                  </Button>
                  
                  <AddToCartButton 
                    product={product} 
                    quantity={quantity} 
                    variantId={selectedVariantId} 
                    className="w-full" 
                  />
                </div>
              )}
            </div>
          ) : (
            /* Non-Bundle: Variants already shown above in price section, just show actions */
            <div className="space-y-4">
              {/* Action Buttons - Primary Actions */}
              <div className="space-y-3">
                <Button
                  onClick={handleBuyNow}
                  disabled={effectiveStock === 0 || (variants.length > 0 && !selectedVariantId)}
                  className="w-full bg-black text-white hover:bg-gray-800 text-lg py-3"
                >
                  Acheter maintenant
                </Button>
                
                <AddToCartButton 
                  product={product} 
                  quantity={quantity} 
                  variantId={selectedVariantId} 
                  className="w-full" 
                />
              </div>
              
              {/* Quantity Selector - Secondary, Smaller */}
              <div className="pt-2 border-t">
                <label className="block text-xs font-medium text-gray-600 mb-2">Quantité</label>
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  max={effectiveStock}
                  disabled={effectiveStock === 0}
                />
              </div>
            </div>
          )}

          {/* Payment/Delivery Info */}
          <div className="flex flex-wrap gap-6 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Paiement à la livraison</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Satisfaction 7 Jours</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Livraison Rapide (24-48h)</span>
            </div>
          </div>

          {/* Delivery Countdown */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-100">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-gray-700">
              Commandez dans <span className="font-semibold">14h 10m</span> et Recevez-le <span className="font-semibold">{getDeliveryDate()}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

