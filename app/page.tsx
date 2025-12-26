import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ProductCard } from '@/components/product/ProductCard'
import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/types/product'

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .limit(4)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching featured products:', error)
    }

    return (data as Product[]) || []
  } catch (err: any) {
    console.error('Error fetching featured products:', err)
    return []
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Construisez, Riez, Apprenez
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Chaque moment de jeu devient une aventure éducative sans écrans
            </p>
            <Link href="/products">
              <Button size="lg">Acheter Maintenant</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Yellow Banner */}
      <section className="py-16" style={{ backgroundColor: '#F6F1BF' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Un souvenir que vous créez ensemble.
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto text-lg">
              Chaque parent rêve de voir son enfant heureux, confiant, épanoui et fier de ses créations.
              Découvrez notre collection de jeux éducatifs conçus pour développer l'esprit et le cœur.
            </p>
            <div className="mt-8">
              <Link href="/products">
                <Button size="lg">Découvrez notre Produit Vedette</Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Développement cognitif', icon: '🧠' },
              { title: 'Motricité fine', icon: '✋' },
              { title: 'Créativité sans limites', icon: '✨' },
              { title: 'Confiance en soi', icon: '🌟' },
            ].map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Découvrez notre Produit Vedette
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/products">
                <Button variant="outline">Voir tous les produits</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Brand Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Une marque locale qui comprend les familles ivoiriennes
            </h2>
            <p className="text-gray-600 text-lg">
              Créé par Miniminds Côte d'Ivoire, nos jeux ont été pensés pour les réalités,
              les valeurs et les besoins des parents d'aujourd'hui : apprentissage, sécurité
              et moments de qualité en famille.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Déjà +500 Parents Satisfaits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Aminata K',
                location: 'Cocody',
                text: 'Mon fils de 5 ans adore ! Il passe des heures à créer. Un excellent jeu éducatif.',
              },
              {
                name: 'Jean-Marc D',
                location: 'Plateau',
                text: 'Qualité au top, livraison rapide. Ma fille développe vraiment sa créativité.',
              },
              {
                name: 'Fatou S',
                location: 'Yopougon',
                text: 'Le meilleur achat pour mes enfants. Ils apprennent sans s\'en rendre compte.',
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-600">- {testimonial.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Des jeux qui forment l'esprit et le cœur
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Avec Miniminds, chaque jeu est une leçon de vie en miniature
          </p>
          <Link href="/products">
            <Button variant="outline" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
              Découvrir nos produits
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

