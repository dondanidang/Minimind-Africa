'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ProductEditForm } from '@/components/admin/ProductEditForm'
import type { ProductPageContent } from '@/types/productPageContent'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
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
    page_content: null as ProductPageContent | null,
  })

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()
      
      if (error) {
        console.error('Error fetching product:', error)
        alert('Error loading product')
        return
      }
      
      if (!product) {
        alert('Product not found')
        return
      }
      
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        price: product.price?.toString() || '0',
        promo_price: product.promo_price?.toString() || '',
        stock: product.stock?.toString() || '0',
        featured: product.featured || false,
        images: Array.isArray(product.images) ? product.images.join('\n') : '',
        assets: (product as any).assets || [],
        bundle_pricing: product.bundle_pricing || [],
        page_content: product.page_content || null,
      })
    } catch (error) {
      console.error('Error fetching product:', error)
      alert('Error loading product')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Convert images textarea (newline-separated URLs) to array
      const imagesArray = formData.images
        .split('\n')
        .map(url => url.trim())
        .filter(Boolean)

      const updateData = {
        name: formData.name,
        slug: formData.slug || null,
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

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId)

      if (error) {
        console.error('Error updating product:', error)
        alert(error.message || 'Error updating product')
        return
      }

      router.push('/admin/products')
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Error updating product')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="mt-2 text-sm text-gray-600">
          Update product information, pricing, images, and content
        </p>
      </div>
      
      <ProductEditForm
        productId={productId}
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        saving={saving}
      />
    </div>
  )
}
