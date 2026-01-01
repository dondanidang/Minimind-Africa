import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/Card'
import { formatPrice, getDisplayPrice, getDiscountPercentage } from '@/lib/utils'
import type { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0] || '/placeholder-product.jpg'
  
  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2 flex-wrap">
              <p className={`text-2xl font-bold ${product.promo_price ? 'text-red-600' : 'text-primary-600'}`}>
                {formatPrice(getDisplayPrice(product))}
              </p>
              {product.promo_price && product.promo_price < product.price && (
                <>
                  <p className="text-lg text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </p>
                  <span className="text-sm font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                    -{getDiscountPercentage(product)}%
                  </span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

