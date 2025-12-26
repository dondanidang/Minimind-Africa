'use client'

import { useState } from 'react'
import type { Review } from '@/types/review'

interface ProductReviewsCarouselProps {
  reviews: Review[]
  title?: string
}

export function ProductReviewsCarousel({ 
  reviews, 
  title = "Déjà plus de 1000 familles et parents satisfaits !" 
}: ProductReviewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  if (reviews.length === 0) return null

  const reviewsPerPage = 3
  const totalPages = Math.ceil(reviews.length / reviewsPerPage)
  const currentReviews = reviews.slice(
    currentIndex * reviewsPerPage,
    (currentIndex + 1) * reviewsPerPage
  )

  const next = () => setCurrentIndex((prev) => (prev + 1) % totalPages)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)

  return (
    <section className="py-16" style={{ backgroundColor: '#F6F1BF' }}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{title}</h2>
        
        <div className="relative max-w-6xl mx-auto">
          {/* Previous Button */}
          {totalPages > 1 && (
            <button
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Previous reviews"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-12">
            {currentReviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${
                        star <= review.rating ? 'text-black' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                {review.comment && (
                  <>
                    <h4 className="font-bold text-lg mb-2">{review.comment.split('.')[0]}.</h4>
                    <p className="text-gray-700 mb-4">{review.comment}</p>
                  </>
                )}
                <p className="font-semibold text-gray-900">
                  - {review.author_name}
                  {review.location && <span className="text-gray-600">, {review.location}</span>}
                </p>
              </div>
            ))}
          </div>

          {/* Next Button */}
          {totalPages > 1 && (
            <button
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Next reviews"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Pagination Dots */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-black' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

