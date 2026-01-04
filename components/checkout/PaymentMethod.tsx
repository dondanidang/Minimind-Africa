'use client'

import Image from 'next/image'

export type PaymentMethodType = 'wave' | 'orange' | 'mtn' | 'moov' | 'djamo'

interface PaymentMethodProps {
  selectedMethod: PaymentMethodType | null
  onMethodChange: (method: PaymentMethodType) => void
}

const paymentMethods = [
  { id: 'wave' as PaymentMethodType, name: 'Wave', logo: '/payment-logos/wave.png' },
  { id: 'orange' as PaymentMethodType, name: 'Orange Money', logo: '/payment-logos/orange.png' },
  { id: 'mtn' as PaymentMethodType, name: 'MTN Money', logo: '/payment-logos/mtn.png' },
  { id: 'moov' as PaymentMethodType, name: 'Moov Money', logo: '/payment-logos/moov.png' },
  { id: 'djamo' as PaymentMethodType, name: 'Djamo', logo: '/payment-logos/djamo.png' },
]

export function PaymentMethod({ selectedMethod, onMethodChange }: PaymentMethodProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Méthode de paiement</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedMethod === method.id
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name="payment_method"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={() => onMethodChange(method.id)}
              className="w-4 h-4 text-primary-600"
            />
            <div className="flex items-center space-x-3 flex-1">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={method.logo}
                  alt={method.name}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-medium">{method.name}</span>
            </div>
          </label>
        ))}
      </div>
      
      {selectedMethod && (
        <p className="text-sm text-gray-600">
          Vous serez redirigé vers l'application {paymentMethods.find(m => m.id === selectedMethod)?.name} pour finaliser le paiement.
        </p>
      )}
    </div>
  )
}
