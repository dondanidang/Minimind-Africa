interface ProductFeaturesProps {
  features?: Array<{ icon: string; label: string }>
}

const defaultFeatures = [
  { icon: '🔒', label: 'Sécurité maximale dès 3 ans' },
  { icon: '🧘‍♀️', label: 'Favorise le calme et la concentration' },
  { icon: '✈️', label: 'À emporter partout, sans contrainte' },
  { icon: '✅', label: 'Zéro pile, Zéro écran' },
  { icon: '✅', label: 'Un jeu pour toute la famille' },
  { icon: '✅', label: 'Apprentissage actif en s\'amusant' },
  { icon: '✅', label: 'Compact, léger sans piles ni bruits' },
]

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
  return (
    <div className="flex flex-wrap gap-4 my-6">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <span className="text-xl">{feature.icon}</span>
          <span className="text-gray-700">{feature.label}</span>
        </div>
      ))}
    </div>
  )
}

