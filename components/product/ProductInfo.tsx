import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types/product'
import type { Review } from '@/types/review'
import { ProductFeatures } from './ProductFeatures'

interface ProductInfoProps {
  product: Product
  reviews?: Review[]
}

export function ProductInfo({ product, reviews = [] }: ProductInfoProps) {
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
        
        {reviews.length > 0 && (
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {averageRating.toFixed(1)} ({reviews.length} avis)
            </span>
          </div>
        )}
        
        <div className="flex items-baseline gap-4 mb-6">
          <p className="text-4xl font-bold text-primary-600">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>

      <ProductFeatures />
      
      {product.description && (
        <div className="prose max-w-none">
          <div 
            className="text-gray-700"
            dangerouslySetInnerHTML={{ 
              __html: product.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            }}
          />
        </div>
      )}
      
      <div className="pt-4 border-t">
        <p className="text-sm text-gray-600">
          {product.stock > 0 ? (
            <span className="text-green-600 font-medium">En stock</span>
          ) : (
            <span className="text-red-600 font-medium">Épuisé</span>
          )}
        </p>
      </div>
    </div>
  )
}

