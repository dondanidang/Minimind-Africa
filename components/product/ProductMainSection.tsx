'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProductGallery } from './ProductGallery'
import { QuantitySelector } from './QuantitySelector'
import { AddToCartButton } from './AddToCartButton'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
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
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0

  const mainFeatures = pageContent?.mainFeatures ?? []
  const whyThisGame = pageContent?.whyThisGame

  const handleBuyNow = () => {
    // Add to cart and redirect to checkout
    addItem(product, quantity)
    router.push('/checkout')
  }

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
            
            <div className="flex items-baseline gap-4 mb-4">
              <p className="text-4xl font-bold text-primary-600">
                {formatPrice(product.price)}
              </p>
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

          {/* Quantity and Buttons */}
          <div className="space-y-4">
            <div className="flex items-end space-x-4">
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
            
            {/* Buy Now Button */}
            <Button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="w-full bg-black text-white hover:bg-gray-800"
            >
              Acheter maintenant
            </Button>
          </div>

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

