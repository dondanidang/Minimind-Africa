'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { FileUploader } from '@/components/admin/FileUploader'
import { AssetsGallery } from '@/components/admin/AssetsGallery'

export default function NewProductPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
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
  })
  // Generate temporary ID for file uploads before product is created
  const [tempProductId] = useState(() => `temp-${Date.now()}-${Math.random().toString(36).substring(7)}`)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

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
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('products')
        .insert(insertData)

      if (error) {
        console.error('Error creating product:', error)
        alert(error.message || 'Error creating product')
        return
      }

      router.push('/admin/products')
    } catch (error) {
      console.error('Error creating product:', error)
      alert('Error creating product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">New Product</h1>
      
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
            productId={tempProductId}
            files={formData.assets}
            onFilesChange={(files) => setFormData({ ...formData, assets: files })}
            label="Assets (Images & Videos for Page Content)"
            maxFiles={50}
            showPreview={false}
          />
          <AssetsGallery assets={formData.assets} />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Product'}
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

