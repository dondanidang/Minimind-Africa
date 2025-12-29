'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckoutForm } from '@/components/checkout/CheckoutForm'
import { OrderSummary } from '@/components/checkout/OrderSummary'
import { PaymentMethod, type PaymentMethodType } from '@/components/checkout/PaymentMethod'
import { useCartStore } from '@/store/cartStore'

interface CheckoutFormData {
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: {
    street: string
    city: string
    postal_code: string
    country: string
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartStore(state => state.items)
  const clearCart = useCartStore(state => state.clearCart)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('mobile_money')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: CheckoutFormData) => {
    setIsSubmitting(true)
    
    try {
      // Prepare order items
      const orderItems = items.map(item => {
        if (!item.product) throw new Error('Product data missing')
        return {
          product_id: item.product_id,
          product_name: item.product.name,
          product_price: item.product.price,
          quantity: item.quantity,
        }
      })

      // Create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          items: orderItems,
          payment_method: 'jeko', // Use Jeko for payment
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create order')
      }

      const { order } = await response.json()

      // Don't clear cart yet - wait for payment confirmation
      // clearCart()

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
        <div className="lg:col-span-2 space-y-8">
          <CheckoutForm onSubmit={handleSubmit} isLoading={isSubmitting} />
          <PaymentMethod
            selectedMethod={paymentMethod}
            onMethodChange={setPaymentMethod}
          />
        </div>
        
        <div className="lg:col-span-1">
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}

