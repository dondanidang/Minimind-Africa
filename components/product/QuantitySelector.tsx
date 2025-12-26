'use client'

import { Button } from '@/components/ui/Button'

interface QuantitySelectorProps {
  quantity: number
  onQuantityChange: (quantity: number) => void
  max?: number
  disabled?: boolean
}

export function QuantitySelector({
  quantity,
  onQuantityChange,
  max,
  disabled = false,
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1)
    }
  }

  const handleIncrease = () => {
    if (!max || quantity < max) {
      onQuantityChange(quantity + 1)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleDecrease}
        disabled={disabled || quantity <= 1}
        className="w-10 h-10"
      >
        −
      </Button>
      <span className="w-12 text-center font-medium">{quantity}</span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleIncrease}
        disabled={disabled || (max ? quantity >= max : false)}
        className="w-10 h-10"
      >
        +
      </Button>
    </div>
  )
}

