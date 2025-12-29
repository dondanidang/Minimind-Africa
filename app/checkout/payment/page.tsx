'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import type { Order, OrderItem } from '@/types/order'

interface OrderWithItems extends Order {
  order_items?: OrderItem[]
}

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('order')
  const clearCart = useCartStore(state => state.clearCart)
  const [order, setOrder] = useState<OrderWithItems | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingPayment, setIsCreatingPayment] = useState(false)

  useEffect(() => {
    if (!orderId) {
      router.push('/checkout')
      return
    }

    // Fetch order details
    fetch(`/api/orders/${orderId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          throw new Error(data.error)
        }
        setOrder(data.order)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching order:', error)
        router.push('/checkout')
      })
  }, [orderId, router])

  const handlePayment = async () => {
    if (!order) return

    setIsCreatingPayment(true)
    try {
      // Create Jeko payment link
      const response = await fetch('/api/payments/jeko/create-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create payment link')
      }

      const { paymentLink } = await response.json()
      
      // Clear cart when payment link is created and user is about to pay
      clearCart()
      
      // Redirect to Jeko payment page
      window.location.href = paymentLink.link
    } catch (error) {
      console.error('Payment error:', error)
      alert('Une erreur est survenue lors de la création du lien de paiement. Veuillez réessayer.')
      setIsCreatingPayment(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Chargement...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Commande introuvable</p>
        <Button onClick={() => router.push('/checkout')} className="mt-4">
          Retour au checkout
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Récapitulatif de votre commande</h1>
          <p className="text-gray-600">Commande #{order.order_number}</p>
        </div>

        <div className="bg-white border rounded-lg p-6 mb-6">
          <div className="space-y-4">
            {order.order_items && order.order_items.length > 0 && (
              <div className="mb-4">
                <h2 className="font-semibold mb-2">Articles commandés</h2>
                <div className="space-y-2">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.product_name} x {item.quantity}</span>
                      <span>{formatPrice(item.product_price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-gray-700">Statut de la commande</span>
              <span className="font-semibold capitalize">{order.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Statut du paiement</span>
              <span className="font-semibold capitalize">{order.payment_status}</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total à payer</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>Important:</strong> Votre commande sera confirmée une fois le paiement effectué.
          </p>
        </div>

        <Button
          onClick={handlePayment}
          disabled={isCreatingPayment || order.payment_status === 'paid'}
          className="w-full"
          size="lg"
        >
          {isCreatingPayment
            ? 'Création du lien de paiement...'
            : order.payment_status === 'paid'
            ? 'Paiement déjà effectué'
            : 'Payer maintenant'}
        </Button>
      </div>
    </div>
  )
}

