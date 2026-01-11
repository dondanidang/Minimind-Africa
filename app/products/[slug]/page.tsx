import { notFound } from 'next/navigation'
import { ProductMainSection } from '@/components/product/ProductMainSection'
import { ProductIdealFeatures } from '@/components/product/ProductIdealFeatures'
import { ProductVideo } from '@/components/product/ProductVideo'
import { ProductScrollingBanner } from '@/components/product/ProductScrollingBanner'
import { ProductZigZagContent } from '@/components/product/ProductZigZagContent'
import { ProductComparisonTable } from '@/components/product/ProductComparisonTable'
import { ProductReviewsCarousel } from '@/components/product/ProductReviewsCarousel'
import { ProductGuarantees } from '@/components/product/ProductGuarantees'
import { ProductFAQs } from '@/components/product/ProductFAQs'
import { ProductCard } from '@/components/product/ProductCard'
import { createClient } from '@/lib/supabase/server'
import { mergeProductContent } from '@/lib/mergeProductContent'
import type { Product } from '@/types/product'
import type { Review } from '@/types/review'

async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!product) return null

  // Fetch variants
  const { data: variants } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', product.id)
    .order('created_at', { ascending: true })

  return {
    ...product,
    variants: variants || [],
  } as Product
}

async function getProductReviews(productId: string): Promise<Review[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })

  return (data as Review[]) || []
}

async function getRelatedProducts(currentProductId: string, limit: number = 4): Promise<Product[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .neq('id', currentProductId)
    .limit(limit)
    .order('created_at', { ascending: false })

  return (data as Product[]) || []
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string }
}) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  const [reviews, relatedProducts] = await Promise.all([
    getProductReviews(product.id),
    getRelatedProducts(product.id),
  ])

  // Merge product page content with defaults
  const pageContent = mergeProductContent(product.page_content)

  return (
    <div>
      {/* 1. Main Section */}
      <ProductMainSection 
        product={product} 
        reviews={reviews}
        pageContent={pageContent}
      />

      {/* 2. Ideal Features Section */}
      <ProductIdealFeatures 
        title={pageContent.idealFeatures?.title}
        features={pageContent.idealFeatures?.features}
      />

      {/* 3. Video Section */}
      {pageContent.video?.url && (
        <ProductVideo 
          videoUrl={pageContent.video.url}
          title={pageContent.video.title}
        />
      )}

      {/* 4. Scrolling Banner */}
      <ProductScrollingBanner 
        texts={pageContent.scrollingBanner?.texts}
        speed={pageContent.scrollingBanner?.speed}
      />

      {/* 5. Zig-zag Content */}
      {pageContent.zigzagContent && pageContent.zigzagContent.length > 0 && (
        <ProductZigZagContent items={pageContent.zigzagContent} />
      )}

      {/* 6. Comparison Table */}
      <ProductComparisonTable
        title={pageContent.comparisonTable?.title}
        subtitle={pageContent.comparisonTable?.subtitle}
        rows={pageContent.comparisonTable?.rows}
      />

      {/* 7. Reviews Carousel */}
      {reviews.length > 0 && (
        <ProductReviewsCarousel reviews={reviews} />
      )}

      {/* 8. Guarantees */}
      <ProductGuarantees 
        title={pageContent.guarantees?.title}
        guarantees={pageContent.guarantees?.items}
      />

      {/* 9. FAQs */}
      <ProductFAQs 
        title={pageContent.faqs?.title}
        faqs={pageContent.faqs?.items}
      />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Produits similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
