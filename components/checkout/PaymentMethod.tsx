'use client'

export type PaymentMethodType = 'cash_on_delivery' | 'mobile_money'

interface PaymentMethodProps {
  selectedMethod: PaymentMethodType
  onMethodChange: (method: PaymentMethodType) => void
}

export function PaymentMethod({ selectedMethod, onMethodChange }: PaymentMethodProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Méthode de paiement</h2>
      
      <div className="space-y-2">
        <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="payment_method"
            value="cash_on_delivery"
            checked={selectedMethod === 'cash_on_delivery'}
            onChange={() => onMethodChange('cash_on_delivery')}
            className="w-4 h-4 text-primary-600"
          />
          <div className="flex-1">
            <p className="font-medium">Paiement à la livraison</p>
            <p className="text-sm text-gray-600">Payez en espèces à la livraison</p>
          </div>
        </label>
        
        <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="payment_method"
            value="mobile_money"
            checked={selectedMethod === 'mobile_money'}
            onChange={() => onMethodChange('mobile_money')}
            className="w-4 h-4 text-primary-600"
          />
          <div className="flex-1">
            <p className="font-medium">Mobile Money</p>
            <p className="text-sm text-gray-600">Orange Money, MTN Mobile Money</p>
          </div>
        </label>
      </div>
    </div>
  )
}

