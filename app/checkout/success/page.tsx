'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { trackPurchase } from '@/lib/analytics'

function SuccessContent() {
  const searchParams = useSearchParams()
  const reference = searchParams.get('reference')
  const orderId = searchParams.get('order')
  const [verifying, setVerifying] = useState(true)
  const [verified, setVerified] = useState(false)
  const [purchaseTracked, setPurchaseTracked] = useState(false)

  useEffect(() => {
    // Verify payment status via API
    if (orderId && !purchaseTracked) {
      fetch(`/api/orders/${orderId}`)
        .then(res => res.json())
        .then(data => {
          if (data.order && data.order.payment_status === 'paid') {
            setVerified(true)
            
            // Track Facebook Pixel Purchase event when payment is confirmed
            // This fires when user returns to site after payment (or webhook received)
            // Only track once per page load
            if (!purchaseTracked) {
              const order = data.order
              const orderItems = data.order.order_items || []
              
              const items = orderItems.map((item: any) => ({
                name: item.product_name,
                price: item.product_price,
                quantity: item.quantity,
              }))
              
              trackPurchase(
                {
                  total: order.total,
                  order_number: order.order_number,
                },
                items
              )
              
              setPurchaseTracked(true)
            }
          }
          setVerifying(false)
        })
        .catch(() => {
          setVerifying(false)
        })
    } else {
      setVerifying(false)
    }
  }, [orderId, purchaseTracked])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Paiement réussi !</h1>
        {reference && (
          <p className="text-lg text-gray-600 mb-2">
            Commande #{reference}
          </p>
        )}
        <p className="text-xl text-gray-600 mb-8">
          {verifying 
            ? 'Vérification du paiement en cours...'
            : verified
            ? 'Votre paiement a été confirmé. Nous avons reçu votre commande et vous contacterons bientôt.'
            : 'Merci pour votre achat. Nous traiterons votre commande sous peu.'}
        </p>
        
        <div className="space-y-4">
          <Link href="/products">
            <Button>Continuer les achats</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center">Chargement...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
