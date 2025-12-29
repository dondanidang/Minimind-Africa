'use client'

import { useState } from 'react'
import type { Review } from '@/types/review'

interface HomeTestimonialsCarouselProps {
  reviews: Review[]
  title?: string
}

export function HomeTestimonialsCarousel({ 
  reviews, 
  title = "Déjà +500 Parents Satisfaits" 
}: HomeTestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  if (reviews.length === 0) return null

  // Show 3 reviews per page
  const reviewsPerPage = 3
  const totalPages = Math.ceil(reviews.length / reviewsPerPage)
  const showCarousel = reviews.length > 3
  
  const currentReviews = reviews.slice(
    currentIndex * reviewsPerPage,
    (currentIndex + 1) * reviewsPerPage
  )

  const next = () => setCurrentIndex((prev) => (prev + 1) % totalPages)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          {title}
        </h2>
        
        <div className="relative max-w-5xl mx-auto">
          {/* Previous Button - Only show if carousel mode */}
          {showCarousel && totalPages > 1 && (
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

          {/* Reviews Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${showCarousel ? 'px-12' : ''}`}>
            {currentReviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm">
                {review.comment && (
                  <p className="text-gray-700 mb-4">"{review.comment}"</p>
                )}
                <p className="font-semibold">{review.author_name}</p>
                {review.location && (
                  <p className="text-sm text-gray-600">- {review.location}</p>
                )}
              </div>
            ))}
          </div>

          {/* Next Button - Only show if carousel mode */}
          {showCarousel && totalPages > 1 && (
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

          {/* Pagination Dots - Only show if carousel mode */}
          {showCarousel && totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-primary-600' : 'bg-gray-300'
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

