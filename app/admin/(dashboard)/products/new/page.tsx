'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ProductEditForm } from '@/components/admin/ProductEditForm'
import type { ProductPageContent } from '@/types/productPageContent'
import type { ProductVariant } from '@/types/product'

export default function NewProductPage() {
  const router = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    promo_price: '',
    stock: '0',
    featured: false,
    images: '' as string,
    assets: [] as string[],
    bundle_pricing: [] as Array<{ quantity: number; price: number }>,
    variants: [] as ProductVariant[],
    page_content: null as ProductPageContent | null,
  })
  // Generate temporary ID for file uploads before product is created
  const [tempProductId] = useState(() => `temp-${Date.now()}-${Math.random().toString(36).substring(7)}`)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Generate slug from name if not provided
      let slug = formData.slug
      if (!slug && formData.name) {
        slug = formData.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      }

      // Convert images textarea (newline-separated URLs) to array
      const imagesArray = formData.images
        .split('\n')
        .map(url => url.trim())
        .filter(Boolean)

      const insertData = {
        name: formData.name,
        slug: slug || null,
        description: formData.description || null,
        price: parseFloat(formData.price),
        promo_price: formData.promo_price ? parseFloat(formData.promo_price) : null,
        stock: parseInt(formData.stock),
        featured: formData.featured,
        images: imagesArray,
        assets: formData.assets.filter(Boolean),
        bundle_pricing: formData.bundle_pricing.length > 0 ? formData.bundle_pricing : null,
        page_content: formData.page_content,
        updated_at: new Date().toISOString(),
      }

      const { data: newProduct, error } = await supabase
        .from('products')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error('Error creating product:', error)
        alert(error.message || 'Error creating product')
        return
      }

      // Insert variants if any
      if (formData.variants.length > 0) {
        const variantsToInsert = formData.variants.map(variant => ({
          product_id: newProduct.id,
          name: variant.name,
          price: variant.price,
          stock: variant.stock,
          images: variant.images || null,
        }))

        const { error: variantsError } = await supabase
          .from('product_variants')
          .insert(variantsToInsert)

        if (variantsError) {
          console.error('Error creating variants:', variantsError)
          alert(`Product created successfully, but failed to save variants: ${variantsError.message}`)
        }
      }

      router.push('/admin/products')
    } catch (error) {
      console.error('Error creating product:', error)
      alert('Error creating product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">New Product</h1>
        <p className="mt-2 text-sm text-gray-600">
          Create a new product with information, pricing, images, and content
        </p>
      </div>
      
      <ProductEditForm
        productId={tempProductId}
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        saving={saving}
      />
    </div>
  )
}

