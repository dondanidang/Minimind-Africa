import type { ProductPageContent, IdealFeature, ZigZagItem, ComparisonRow, Guarantee, FAQ, WhyThisGameItem } from '@/types/productPageContent'

export const defaultIdealFeatures: IdealFeature[] = [
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

export const defaultScrollingBannerTexts = [
  'Des jeux qui rapprochent, font réfléchir et rendent fiers.',
  'De petites mains pour de grandes découvertes.',
  'Apprendre en s\'amusant, grandir en créant.',
  'Nos jouets font grandir.',
]

export const defaultZigZagContent: ZigZagItem[] = [
  {
    image: '/placeholder-product.jpg',
    title: 'Un entraînement pour le cerveau... déguisé en fou rire',
    description: 'Des rires, de la concentration et des souvenirs, sans écran, juste du fun et de l\'équilibre.',
    alignment: 'left',
  },
  {
    image: '/placeholder-product.jpg',
    title: 'Un jeu qui rassemble toutes les générations (sans les écrans)',
    description: 'Un jeu qui met tout le monde sur un pied d\'égalité : parents, enfants, grands-parents, amis.',
    alignment: 'right',
  },
  {
    image: '/placeholder-product.jpg',
    title: 'Solide, sûr et fait pour durer — même après 100 chutes',
    description: 'Fabriqué en plastique ABS haute densité, sans bords tranchants, non toxique et 100% sûr.',
    alignment: 'left',
  },
]

export const defaultComparisonRows: ComparisonRow[] = [
  { feature: 'Solidité & sécurité', ourGame: true, otherToys: false },
  { feature: 'Durabilité', ourGame: true, otherToys: false },
  { feature: 'Adapté dès 3 ans', ourGame: true, otherToys: false },
  { feature: 'Sans bruits perturbateurs', ourGame: true, otherToys: false },
  { feature: 'Évolue avec l\'enfant', ourGame: true, otherToys: false },
]

export const defaultGuarantees: Guarantee[] = [
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

export const defaultFAQs: FAQ[] = [
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

export const defaultMainFeatures = [
  { icon: '🔒', label: 'Sécurité maximale dès 3 ans' },
  { icon: '🧘‍♀️', label: 'Favorise le calme et la concentration' },
  { icon: '✈️', label: 'À emporter partout, sans contrainte' },
]

export const defaultWhyThisGameItems: WhyThisGameItem[] = [
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

export const defaultProductPageContent: ProductPageContent = {
  idealFeatures: {
    title: "Ce qui rend ce jeu idéal pour les parents d'aujourd'hui",
    features: defaultIdealFeatures,
  },
  video: {
    url: 'https://miniminds.africa/cdn/shop/videos/c/vp/06c17f640fb54173800f925c1d442100/06c17f640fb54173800f925c1d442100.HD-1080p-7.2Mbps-64008249.mp4?v=0',
    title: 'Vidéo du produit',
  },
  scrollingBanner: {
    texts: defaultScrollingBannerTexts,
    speed: 30,
  },
  zigzagContent: defaultZigZagContent,
  comparisonTable: {
    title: "Ce qu'on vous garantit",
    subtitle: '(et pourquoi vous pouvez le commander les yeux fermés)',
    rows: defaultComparisonRows,
  },
  guarantees: {
    title: "Les Garanties Que l'on Propose",
    items: defaultGuarantees,
  },
  faqs: {
    title: 'Questions Fréquentes',
    items: defaultFAQs,
  },
  urgencyCount: 7,
  mainFeatures: defaultMainFeatures,
  whyThisGame: {
    title: "TOUR TETRA™ — Pourquoi ce jeu vaut mille fois plus qu'un jouet électronique",
    items: defaultWhyThisGameItems,
  },
}

