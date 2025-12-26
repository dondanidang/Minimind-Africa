interface Benefit {
  title: string
  description: string
}

interface ProductBenefitsProps {
  benefits?: Benefit[]
}

const defaultBenefits: Benefit[] = [
  {
    title: 'Des compétences motrices pour toute une vie',
    description: 'Contrairement aux jeux vidéo ou aux jouets « tout‑prêts », ce jeu développe la **motricité fine**, la **coordination main‑œil** et la **logique**. En empilant les pièces, l\'enfant apprend naturellement à équilibrer, ajuster et anticiper. Des compétences essentielles dès le plus jeune âge, qui lui servent bien au‑delà du jeu.',
  },
  {
    title: 'Un tremplin pour l\'imagination et la pensée critique',
    description: 'Ici, pas d\'écran, pas de scénario imposé. L\'enfant est libre de créer ses propres défis, d\'expérimenter, de recommencer autrement. Chaque partie devient une nouvelle aventure, stimulant **la créativité**, **l\'imagination** et **la réflexion autonome**. Le jeu s\'adapte à l\'enfant… pas l\'inverse.',
  },
  {
    title: 'Un cerveau en pleine construction… tout en jouant',
    description: 'Chaque pièce posée est une mini‑expérience. L\'enfant découvre par lui‑même les notions de **forme**, **poids**, **équilibre**, **proportion** et **gravité**. En construisant, il expérimente, se trompe, corrige — un processus clé du **développement cognitif**, rendu ludique et naturel.',
  },
  {
    title: 'Un jeu qui évolue avec l\'enfant, pas un gadget éphémère',
    description: 'Dès 3 ans, le jeu commence simplement. Puis, au fil des années, les défis deviennent plus complexes, plus créatifs, plus stratégiques. Ce n\'est pas un jouet que l\'on délaisse après quelques semaines, mais un **jeu durable** qui accompagne l\'enfant dans sa croissance, sa concentration et sa confiance en lui.',
  },
  {
    title: 'Créer des souvenirs, pas juste du divertissement',
    description: 'Ce jeu ne se joue pas uniquement seul. Il rassemble. Autour de la table, enfants, parents et grands‑parents partagent des moments de rire, de tension joyeuse et de fierté quand la tour tient debout. Ces instants renforcent la **coopération**, l\'**estime de soi**, l\'**autonomie**… et créent des souvenirs qui restent.',
  },
]

export function ProductBenefits({ benefits = defaultBenefits }: ProductBenefitsProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Pourquoi Il vous faut ce jouet ?
        </h2>
        
        <div className="max-w-4xl mx-auto space-y-12">
          {benefits.map((benefit, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {index + 1} - {benefit.title}
              </h3>
              <div 
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ 
                  __html: benefit.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

