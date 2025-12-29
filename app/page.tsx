import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ProductCard } from '@/components/product/ProductCard'
import { HomeTestimonialsCarousel } from '@/components/home/HomeTestimonialsCarousel'
import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/types/product'
import type { Review } from '@/types/review'

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

async function getRandomReviews(limit: number = 5): Promise<Review[]> {
  try {
    const supabase = await createClient()
    // Fetch reviews - we'll filter and shuffle in JavaScript
    // Fetch more than needed to ensure we have enough with comments
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .limit(limit * 3) // Fetch more to ensure we have enough with comments

    if (error) {
      console.error('Error fetching reviews:', error)
      return []
    }

    // Filter to only reviews with comments and shuffle
    const reviewsWithComments = (data as Review[] || []).filter(
      (review) => review.comment && review.comment.trim().length > 0
    )

    // Shuffle array using Fisher-Yates algorithm
    const shuffled = [...reviewsWithComments]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    // Return only the requested limit
    return shuffled.slice(0, limit)
  } catch (err: any) {
    console.error('Error fetching reviews:', err)
    return []
  }
}

export default async function HomePage() {
  const [featuredProducts, reviews] = await Promise.all([
    getFeaturedProducts(),
    getRandomReviews(5),
  ])

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center bg-no-repeat w-full py-32"
        style={{
          backgroundImage: 'url(https://miniminds.africa/cdn/shop/files/MIniminds_Banner_Homepage.png)',
          minHeight: '600px',
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              Construisez, Riez, Apprenez
            </h1>
            <p className="text-xl text-white mb-8">
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
      {reviews.length > 0 && (
        <HomeTestimonialsCarousel reviews={reviews} />
      )}

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

