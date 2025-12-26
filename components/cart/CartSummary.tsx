'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'

export function CartSummary() {
  const total = useCartStore(state => state.getTotal())
  const items = useCartStore(state => state.items)

  return (
    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-bold">Résumé de la commande</h2>
      
      <div className="space-y-2">
        <div className="flex justify-between text-gray-700">
          <span>Sous-total</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Livraison</span>
          <span className="text-green-600">Gratuite</span>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
      
      <Link href="/checkout" className="block">
        <Button className="w-full" size="lg" disabled={items.length === 0}>
          Procéder au paiement
        </Button>
      </Link>
      
      <Link href="/products" className="block text-center text-primary-600 hover:underline">
        Continuer les achats
      </Link>
    </div>
  )
}

