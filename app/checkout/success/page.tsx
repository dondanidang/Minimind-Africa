import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

function SuccessContent() {
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
        
        <h1 className="text-4xl font-bold mb-4">Commande confirmée !</h1>
        <p className="text-xl text-gray-600 mb-8">
          Merci pour votre achat. Nous avons reçu votre commande et vous contacterons bientôt.
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

