'use client'

import { useState, FormEvent } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface CheckoutFormData {
  customer_name: string
  customer_phone: string
  shipping_address: string
}

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => Promise<void>
  isLoading?: boolean
}

export function CheckoutForm({ onSubmit, isLoading = false }: CheckoutFormProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    customer_name: '',
    customer_phone: '',
    shipping_address: '',
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white border rounded-lg p-6 space-y-6">
        <div>
          <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-2">
            Nom complet *
          </label>
          <Input
            id="customer_name"
            type="text"
            required
            value={formData.customer_name}
            onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
            placeholder="Votre nom complet"
          />
        </div>
        
        <div>
          <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700 mb-2">
            Numéro de téléphone *
          </label>
          <Input
            id="customer_phone"
            type="tel"
            required
            value={formData.customer_phone}
            onChange={(e) => setFormData(prev => ({ ...prev, customer_phone: e.target.value }))}
            placeholder="+225 XX XX XX XX XX"
          />
        </div>
        
        <div>
          <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700 mb-2">
            Adresse de livraison *
          </label>
          <Input
            id="shipping_address"
            type="text"
            required
            value={formData.shipping_address}
            onChange={(e) => setFormData(prev => ({ ...prev, shipping_address: e.target.value }))}
            placeholder="Votre adresse complète de livraison"
          />
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading ? 'Traitement...' : 'Passer la commande'}
      </Button>
    </form>
  )
}
