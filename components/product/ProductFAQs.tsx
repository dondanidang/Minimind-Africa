import type { FAQ } from '@/types/productPageContent'

interface ProductFAQsProps {
  faqs?: FAQ[]
  title?: string
}

const defaultFAQs: FAQ[] = [
  {
    question: 'Je ne suis pas sûr que ce jeu tienne dans le temps, les blocs vont se casser rapidement',
    answer: 'Les blocs sont conçus dans un plastique ABS haute densité utilisé dans les jouets éducatifs professionnels : résistant aux chocs, durable, sans risque de fissure même après des centaines de chutes',
  },
  {
    question: 'Est-ce que le jeu est vraiment fun pour des adultes — ou c\'est juste pour les enfants ?',
    answer: 'Conçu pour toutes les générations : **testé en team building, soirées jeux, apéros** — et adoré par les adultes (surtout à partir du 3e round 😄).',
  },
  {
    question: 'Le jeu va‑t‑il vraiment développer des compétences utiles ou juste faire perdre du temps ?',
    answer: 'Coordination, patience, logique, travail en équipe, gestion du stress… C\'est **une école de la stratégie ludique**, pas juste un passe-temps.',
  },
  {
    question: 'Est-ce que c\'est un bon cadeau ou juste un gadget qu\'on oublie vite ?',
    answer: 'C\'est LE cadeau inattendu qui fait mouche. Une activité réelle dans un monde saturé d\'écrans. **Il surprend, amuse et rassemble.**',
  },
  {
    question: 'Est-ce facile à ranger / à transporter si je veux l\'emmener en voyage ?',
    answer: 'Fourni avec un **sac de rangement compact**. Tu peux l\'emmener partout : vacances, week-end, soirée chez des potes.',
  },
  {
    question: 'Est‑ce que c\'est éducatif ou vraiment juste un jeu d\'équilibre ?',
    answer: 'Éducatif ET fun. Il entraîne la **motricité fine, la concentration, la créativité**, et même la visualisation spatiale.',
  },
  {
    question: 'Pourquoi les parents ivoiriens l\'adorent ?',
    answer: 'Parce qu\'il reflète leurs valeurs : éducation, famille et partage. Les parents ivoiriens adorent nos jouets pour leur simplicité, leur qualité et le fait qu\'il crée de vrais moments de complicité avec leurs enfants.',
  },
  {
    question: 'Combien de temps prend la livraison ?',
    answer: '📦 Abidjan : livraison sous 24 à 48 heures. 🛵 Grand Bassam, Bingerville, Anyama : 48 à 72 heures maximum. Nos livreurs vous contactent par téléphone avant la livraison pour confirmer l\'adresse exacte.',
  },
  {
    question: 'Et si je commande et que ça ne me plaît pas — est‑ce facile de retourner ?',
    answer: 'Aucun risque : tu essaies pendant **07 jours**. Si tu n\'es pas fan, tu nous renvoies le tout et tu es **remboursé sans discussion.**',
  },
]

export function ProductFAQs({ 
  faqs = defaultFAQs,
  title = "Questions Fréquentes"
}: ProductFAQsProps) {
  return (
    <section className="py-16" style={{ backgroundColor: '#CCB5D9' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm uppercase text-gray-600 mb-2">FAQS</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-12">{title}</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="bg-white p-6 rounded-lg">
                <summary className="font-semibold text-lg cursor-pointer flex justify-between items-center">
                  <span>{faq.question}</span>
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div 
                  className="text-gray-700 mt-4 prose max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: faq.answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  }}
                />
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

