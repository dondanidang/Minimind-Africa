'use client'

import { useState, FormEvent } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

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

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => Promise<void>
  isLoading?: boolean
}

export function CheckoutForm({ onSubmit, isLoading = false }: CheckoutFormProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: {
      street: '',
      city: '',
      postal_code: '',
      country: 'Côte d\'Ivoire',
    },
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const handleChange = (field: string, value: string) => {
    if (field.startsWith('shipping_address.')) {
      const addressField = field.replace('shipping_address.', '')
      setFormData(prev => ({
        ...prev,
        shipping_address: {
          ...prev.shipping_address,
          [addressField]: value,
        },
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Informations de contact</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom complet *
            </label>
            <Input
              id="customer_name"
              type="text"
              required
              value={formData.customer_name}
              onChange={(e) => handleChange('customer_name', e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <Input
              id="customer_email"
              type="email"
              required
              value={formData.customer_email}
              onChange={(e) => handleChange('customer_email', e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone *
            </label>
            <Input
              id="customer_phone"
              type="tel"
              required
              value={formData.customer_phone}
              onChange={(e) => handleChange('customer_phone', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Adresse de livraison</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
              Rue et numéro *
            </label>
            <Input
              id="street"
              type="text"
              required
              value={formData.shipping_address.street}
              onChange={(e) => handleChange('shipping_address.street', e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              Ville *
            </label>
            <Input
              id="city"
              type="text"
              required
              value={formData.shipping_address.city}
              onChange={(e) => handleChange('shipping_address.city', e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              Pays *
            </label>
            <Input
              id="country"
              type="text"
              required
              disabled
              value={formData.shipping_address.country}
              onChange={(e) => handleChange('shipping_address.country', e.target.value)}
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading ? 'Traitement...' : 'Passer la commande'}
      </Button>
    </form>
  )
}

