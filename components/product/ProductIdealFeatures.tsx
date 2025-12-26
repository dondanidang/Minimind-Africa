'use client'

import { useState } from 'react'
import type { IdealFeature } from '@/types/productPageContent'

interface ProductIdealFeaturesProps {
  title?: string
  features?: IdealFeature[]
}

const defaultFeatures: IdealFeature[] = [
  {
    icon: '✓',
    title: 'Zéro écran, zéro pile',
    description: 'Un jeu calme, sans bruit ni surexcitation. Loin des écrans, il recentre l\'enfant sur l\'essentiel : le plaisir simple, la concentration, la créativité.',
  },
  {
    icon: '✓',
    title: 'Un jeu pour tous',
    description: 'Tous les âges peuvent jouer ensemble, créant des moments de partage intergénérationnel.',
  },
  {
    icon: '✓',
    title: 'Apprentissage actif',
    description: 'L\'enfant apprend en manipulant, en expérimentant et en créant.',
  },
  {
    icon: '✓',
    title: 'Solide et durable',
    description: 'Fabriqué en plastique ABS haute densité, résistant aux chocs.',
  },
  {
    icon: '✓',
    title: '100 idées, 1 seul jeu',
    description: 'Infinite possibilités de créations et de défis.',
  },
  {
    icon: '✓',
    title: 'À emporter partout',
    description: 'Compact et léger, facile à transporter.',
  },
]

export function ProductIdealFeatures({ 
  title = "Ce qui rend ce jeu idéal pour les parents d'aujourd'hui",
  features = defaultFeatures 
}: ProductIdealFeaturesProps) {
  const [expandedIndex, setExpandedIndex] = useState(0)

  return (
    <section className="py-16" style={{ backgroundColor: '#F6F1BF' }}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{title}</h2>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-lg"
              style={{ backgroundColor: '#CCB5D9' }}
            >
              <button
                onClick={() => setExpandedIndex(index === expandedIndex ? -1 : index)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary-600 font-bold">
                    {feature.icon}
                  </div>
                  <span className="font-semibold text-gray-900">{feature.title}</span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-700 transition-transform ${
                    index === expandedIndex ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {index === expandedIndex && (
                <div className="px-4 pb-4 pt-2 text-gray-700">
                  {feature.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

