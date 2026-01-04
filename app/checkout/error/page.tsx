'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

function ErrorContent() {
  const searchParams = useSearchParams()
  const reference = searchParams.get('reference')
  const orderId = searchParams.get('order')
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then(res => res.json())
        .then(data => {
          if (data.order) {
            setOrder(data.order)
          }
        })
        .catch(console.error)
    }
  }, [orderId])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Paiement échoué</h1>
        {reference && (
          <p className="text-lg text-gray-600 mb-2">
            Commande #{reference}
          </p>
        )}
        <p className="text-xl text-gray-600 mb-8">
          Le paiement n'a pas pu être effectué. Veuillez réessayer ou choisir une autre méthode de paiement.
        </p>
        
        <div className="space-y-4">
          {order && (
            <Link href={`/checkout/payment?order=${order.id}`}>
              <Button>Réessayer le paiement</Button>
            </Link>
          )}
          <Link href="/products">
            <Button variant="outline">Retour aux produits</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutErrorPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center">Chargement...</div>}>
      <ErrorContent />
    </Suspense>
  )
}

