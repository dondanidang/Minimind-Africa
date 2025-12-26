import type { Guarantee } from '@/types/productPageContent'

interface ProductGuaranteesProps {
  title?: string
  guarantees?: Guarantee[]
}

const defaultGuarantees: Guarantee[] = [
  {
    icon: '🚚',
    title: 'Livraison Gratuite',
    subtitle: 'La livraison est gratuite partout à Abidjan',
  },
  {
    icon: '📦',
    title: 'Satisfaction 7 jours',
    subtitle: 'Retournez votre article sous 7 jours si besoin',
  },
  {
    icon: '💵',
    title: 'Paiement à la Livraison',
    subtitle: 'Payez uniquement à la réception de votre colis',
  },
  {
    icon: '📞',
    title: 'Service Client à l\'écoute',
    subtitle: 'Une question? On est dispo du lundi au vendredi',
  },
]

export function ProductGuarantees({ 
  title = "Les Garanties Que l'on Propose",
  guarantees = defaultGuarantees 
}: ProductGuaranteesProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {guarantees.map((guarantee, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl mb-4">{guarantee.icon}</div>
              <h3 className="font-bold text-lg mb-2">{guarantee.title}</h3>
              <p className="text-sm text-gray-600">{guarantee.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

