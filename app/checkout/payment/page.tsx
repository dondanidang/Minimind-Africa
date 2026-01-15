'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import { trackInitiatePayment } from '@/lib/analytics'
import { PaymentMethod, type PaymentMethodType } from '@/components/checkout/PaymentMethod'
import type { Order, OrderItem } from '@/types/order'

interface OrderWithItems extends Order {
  order_items?: OrderItem[]
}

function PaymentPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('order')
  const [order, setOrder] = useState<OrderWithItems | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingPayment, setIsCreatingPayment] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType | null>(null)

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
    if (!order || !selectedPaymentMethod) {
      alert('Veuillez sélectionner une méthode de paiement')
      return
    }

    setIsCreatingPayment(true)
    try {
      // Track Facebook Pixel InitiatePayment event
      trackInitiatePayment(order.total, 'XOF', order.order_number)
      
      // Create Jeko payment request
      const response = await fetch('/api/payments/jeko/create-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
          paymentMethod: selectedPaymentMethod,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create payment request')
      }

      const { paymentRequest } = await response.json()
      
      // Redirect to Jeko redirect URL (which will redirect to mobile app)
      window.location.href = paymentRequest.redirectUrl
    } catch (error) {
      console.error('Payment error:', error)
      alert('Une erreur est survenue lors de la création de la demande de paiement. Veuillez réessayer.')
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Finaliser votre paiement</h1>
          <p className="text-gray-600">Commande #{order.order_number}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Récapitulatif de votre commande</h2>
              <div className="space-y-4">
                {order.order_items && order.order_items.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Articles commandés</h3>
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
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total à payer</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <PaymentMethod
                selectedMethod={selectedPaymentMethod}
                onMethodChange={setSelectedPaymentMethod}
              />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white border rounded-lg p-6 sticky top-4">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-700">Statut de la commande</span>
                  <span className="font-semibold capitalize">{order.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Statut du paiement</span>
                  <span className="font-semibold capitalize">{order.payment_status}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold mb-4">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                  <Button
                    onClick={handlePayment}
                    disabled={isCreatingPayment || order.payment_status === 'paid' || !selectedPaymentMethod}
                    className="w-full !py-5 min-h-[3.5rem]"
                    size="lg"
                  >
                    {isCreatingPayment
                      ? 'Redirection...'
                      : order.payment_status === 'paid'
                      ? 'Paiement déjà effectué'
                      : !selectedPaymentMethod
                      ? 'Sélectionnez une méthode'
                      : 'Payer maintenant'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
          <p className="text-sm text-yellow-800">
            <strong>Important:</strong> Vous serez redirigé vers l'application de paiement mobile pour finaliser le paiement. 
            Vous serez automatiquement redirigé vers notre site après le paiement.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Chargement...</p>
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  )
}
