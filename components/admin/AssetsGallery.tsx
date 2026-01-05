'use client'

import { useState } from 'react'

interface AssetsGalleryProps {
  assets: string[]
  title?: string
}

export function AssetsGallery({ assets, title = 'Uploaded Assets' }: AssetsGalleryProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = async (url: string, index: number) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
      alert('Failed to copy URL')
    }
  }

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
  }

  const isVideo = (url: string) => {
    return /\.(mp4|webm|ogg|mov)$/i.test(url)
  }

  if (assets.length === 0) {
    return null
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {assets.map((url, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 relative">
              {isImage(url) ? (
                <img
                  src={url}
                  alt={`Asset ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : isVideo(url) ? (
                <video
                  src={url}
                  className="w-full h-full object-cover"
                  controls={false}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400 text-xs">File</span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(url, index)}
              className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              title="Copy URL"
            >
              {copiedIndex === index ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
            <div className="mt-1 text-xs text-gray-500 truncate" title={url}>
              {url.split('/').pop()}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Hover over an asset and click the copy icon to copy its URL
      </p>
    </div>
  )
}

