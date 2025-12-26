import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function CartEmpty() {
  return (
    <div className="text-center py-12">
      <svg
        className="mx-auto h-24 w-24 text-gray-400 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h2>
      <p className="text-gray-600 mb-6">Découvrez nos produits éducatifs</p>
      <Link href="/products">
        <Button>Continuer les achats</Button>
      </Link>
    </div>
  )
}

