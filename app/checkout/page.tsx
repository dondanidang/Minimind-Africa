'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckoutForm } from '@/components/checkout/CheckoutForm'
import { OrderSummary } from '@/components/checkout/OrderSummary'
import { useCartStore } from '@/store/cartStore'
import { getPriceForQuantity } from '@/lib/utils'
import { trackInitiateCheckout } from '@/lib/analytics'

interface CheckoutFormData {
  customer_name: string
  customer_phone: string
  shipping_address: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartStore(state => state.items)
  const clearCart = useCartStore(state => state.clearCart)
  const getTotal = useCartStore(state => state.getTotal)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: CheckoutFormData) => {
    setIsSubmitting(true)
    
    try {
      // Track Facebook Pixel InitiateCheckout event
      const cartTotal = getTotal()
      trackInitiateCheckout(cartTotal)

      // Prepare order items (use bundle pricing, promo price, or variant price if available)
      const orderItems = items.map(item => {
        if (!item.product) throw new Error('Product data missing')
        
        // Handle bundle items
        if (item.is_bundle && item.bundle_price !== undefined) {
          const pricePerUnit = item.bundle_price
          // Build product name with bundle info and variant selections
          let productName = item.product.name
          if (item.bundle_quantity) {
            productName += ` (Pack de ${item.bundle_quantity})`
          }
          if (item.bundle_variant_selections && item.bundle_variant_selections.length > 0) {
            const variantNames = item.bundle_variant_selections.map(s => s.variant_name).join(', ')
            productName += ` - ${variantNames}`
          }
          return {
            product_id: item.product_id,
            product_name: productName,
            product_price: pricePerUnit,
            quantity: item.quantity,
          }
        }
        
        // Handle regular items
        // Calculate total price for this quantity (handles variants)
        const totalPrice = getPriceForQuantity(item.product, item.quantity, item.variant || null)
        // Store the effective price per unit (total / quantity)
        const pricePerUnit = totalPrice / item.quantity
        // Include variant name in product name if variant is selected
        const productName = item.variant 
          ? `${item.product.name} - ${item.variant.name}`
          : item.product.name
        return {
          product_id: item.product_id,
          product_name: productName,
          product_price: pricePerUnit,
          quantity: item.quantity,
        }
      })

      // Create order - convert shipping_address string to JSONB format expected by API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: formData.customer_name,
          customer_phone: formData.customer_phone,
          customer_email: null, // Not required anymore
          shipping_address: formData.shipping_address,
          items: orderItems,
          payment_method: 'jeko', // Use Jeko for payment
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create order')
      }

      const { order } = await response.json()

      // Clear cart when order is successfully created
      clearCart()

      // Redirect to payment page with order ID
      router.push(`/checkout/payment?order=${order.id}`)
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Une erreur est survenue lors de la commande. Veuillez réessayer.')
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
          <a href="/products" className="text-primary-600 hover:underline">
            Continuer les achats
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm onSubmit={handleSubmit} isLoading={isSubmitting} />
        </div>
        
        <div className="lg:col-span-1">
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}
