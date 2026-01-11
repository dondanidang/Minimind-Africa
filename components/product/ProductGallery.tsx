'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0] || '/placeholder-product.jpg')
  const [showPrevArrow, setShowPrevArrow] = useState(false)
  const [showNextArrow, setShowNextArrow] = useState(false)
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)
  const maxVisible = 5
  const thumbnailWidth = 96 // w-24 = 96px
  const gap = 16 // gap-4 = 16px
  const visibleWidth = (thumbnailWidth + gap) * maxVisible - gap

  // Check scroll position and update arrow visibility
  const checkScrollPosition = () => {
    if (!thumbnailContainerRef.current) return
    const container = thumbnailContainerRef.current
    const { scrollLeft, scrollWidth, clientWidth } = container
    
    setShowPrevArrow(scrollLeft > 10)
    setShowNextArrow(scrollLeft < scrollWidth - clientWidth - 10) // 10px threshold
  }

  // Update selected image when images array changes (e.g., variant change)
  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0])
    }
  }, [images])

  // Setup scroll listener and initial scroll position
  useEffect(() => {
    const container = thumbnailContainerRef.current
    if (!container) return

    checkScrollPosition()
    container.addEventListener('scroll', checkScrollPosition)
    return () => container.removeEventListener('scroll', checkScrollPosition)
  }, [images.length])

  // Scroll to show selected thumbnail
  useEffect(() => {
    const selectedIndex = images.indexOf(selectedImage)
    if (selectedIndex >= 0 && thumbnailContainerRef.current) {
      const container = thumbnailContainerRef.current
      const scrollPosition = selectedIndex * (thumbnailWidth + gap)
      const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth)
      const targetScroll = Math.min(scrollPosition, maxScroll)
      
      container.scrollTo({ left: targetScroll, behavior: 'smooth' })
      
      // Check position after scroll animation
      setTimeout(checkScrollPosition, 300)
    }
  }, [selectedImage, images])

  if (images.length === 0) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <Image
          src="/placeholder-product.jpg"
          alt={productName}
          fill
          className="object-cover"
        />
      </div>
    )
  }

  const handlePrevious = () => {
    if (thumbnailContainerRef.current) {
      const container = thumbnailContainerRef.current
      const scrollAmount = thumbnailWidth + gap
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    }
  }

  const handleNext = () => {
    if (thumbnailContainerRef.current) {
      const container = thumbnailContainerRef.current
      const scrollAmount = thumbnailWidth + gap
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const hasMoreThanMax = images.length > maxVisible

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={selectedImage}
          alt={productName}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnail Carousel */}
      {images.length > 1 && (
        <div className="relative">
          {/* Previous Button */}
          {hasMoreThanMax && showPrevArrow && (
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Previous images"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Thumbnail Container */}
          <div
            ref={thumbnailContainerRef}
            className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              maxWidth: hasMoreThanMax ? `${visibleWidth}px` : '100%',
              margin: hasMoreThanMax ? '0 auto' : '0'
            }}
          >
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`relative flex-shrink-0 aspect-square w-24 overflow-hidden rounded-md border-2 transition-colors ${
                  selectedImage === image
                    ? 'border-primary-600'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <Image
                  src={image}
                  alt={`${productName} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            ))}
          </div>

          {/* Next Button */}
          {hasMoreThanMax && showNextArrow && (
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Next images"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

