'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import { PageContentEditor } from '@/components/admin/PageContentEditor'
import { FileUploader } from '@/components/admin/FileUploader'
import { AssetsGallery } from '@/components/admin/AssetsGallery'
import type { Product } from '@/types/product'
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
  const [bundleQuantity, setBundleQuantity] = useState('')
  const [bundlePrice, setBundlePrice] = useState('')

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

  const addBundle = () => {
    const quantity = parseInt(bundleQuantity)
    const price = parseFloat(bundlePrice)
    if (quantity > 0 && price > 0) {
      setFormData({
        ...formData,
        bundle_pricing: [...formData.bundle_pricing, { quantity, price }],
      })
      setBundleQuantity('')
      setBundlePrice('')
    }
  }

  const removeBundle = (index: number) => {
    setFormData({
      ...formData,
      bundle_pricing: formData.bundle_pricing.filter((_, i) => i !== index),
    })
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Auto-generated from name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (XOF) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Promo Price (XOF)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.promo_price}
              onChange={(e) => setFormData({ ...formData, promo_price: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock *
          </label>
          <input
            type="number"
            required
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Featured</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images (Gallery) *
          </label>
          <textarea
            value={formData.images}
            onChange={(e) => setFormData({ ...formData, images: e.target.value })}
            rows={6}
            className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm"
            placeholder="Enter image URLs, one per line:&#10;https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
          />
          <p className="mt-1 text-xs text-gray-500">
            Enter image URLs, one per line. These images will appear in the product gallery.
          </p>
        </div>

        <div>
          <FileUploader
            productId={productId}
            files={formData.assets}
            onFilesChange={(files) => setFormData({ ...formData, assets: files })}
            label="Assets (Images & Videos for Page Content)"
            maxFiles={50}
            showPreview={false}
          />
          <AssetsGallery assets={formData.assets} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bundle Pricing
          </label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input
              type="number"
              min="1"
              value={bundleQuantity}
              onChange={(e) => setBundleQuantity(e.target.value)}
              placeholder="Quantity"
              className="rounded-md border border-gray-300 px-3 py-2"
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={bundlePrice}
              onChange={(e) => setBundlePrice(e.target.value)}
              placeholder="Price (XOF)"
              className="rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <Button type="button" onClick={addBundle} className="mb-2">
            Add Bundle
          </Button>
          <div className="space-y-2 mt-2">
            {formData.bundle_pricing.map((bundle, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-700">
                  {bundle.quantity}x for {formatPrice(bundle.price)}
                </span>
                <button
                  type="button"
                  onClick={() => removeBundle(idx)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <PageContentEditor
            value={formData.page_content}
            onChange={(value) => setFormData({ ...formData, page_content: value })}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

