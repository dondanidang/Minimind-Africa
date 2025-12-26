export function ProductTrustBadges() {
  const badges = [
    {
      title: 'Livraison Gratuite',
      description: 'La livraison est gratuite partout à Abidjan',
    },
    {
      title: 'Satisfaction 7 jours',
      description: 'Retournez votre article sous 7 jours si besoin',
    },
    {
      title: 'Paiement à la Livraison',
      description: 'Payez uniquement à la réception de votre colis',
    },
    {
      title: 'Service Client à l\'écoute',
      description: 'Une question? On est dispo du lundi au vendredi',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
      {badges.map((badge, index) => (
        <div key={index} className="text-center p-4 border rounded-lg">
          <h3 className="font-bold text-lg mb-2">{badge.title}</h3>
          <p className="text-sm text-gray-600">{badge.description}</p>
        </div>
      ))}
    </div>
  )
}

