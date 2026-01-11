'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import { PageContentEditor } from '@/components/admin/PageContentEditor'
import { FileUploader } from '@/components/admin/FileUploader'
import { AssetsGallery } from '@/components/admin/AssetsGallery'
import type { ProductPageContent } from '@/types/productPageContent'
import type { ProductVariant } from '@/types/product'

interface ProductEditFormProps {
  productId: string
  formData: {
    name: string
    slug: string
    description: string
    price: string
    promo_price: string
    stock: string
    featured: boolean
    images: string
    assets: string[]
    bundle_pricing: Array<{ quantity: number; price: number }>
    variants: ProductVariant[]
    page_content: ProductPageContent | null
  }
  onFormDataChange: (data: any) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  saving: boolean
}

export function ProductEditForm({
  productId,
  formData,
  onFormDataChange,
  onSubmit,
  onCancel,
  saving
}: ProductEditFormProps) {
  const [bundleQuantity, setBundleQuantity] = useState('')
  const [bundlePrice, setBundlePrice] = useState('')
  const [variantName, setVariantName] = useState('')
  const [variantPrice, setVariantPrice] = useState('')
  const [variantStock, setVariantStock] = useState('')
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    pricing: true,
    variants: false,
    images: true,
    assets: true,
    content: false,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const addBundle = () => {
    const quantity = parseInt(bundleQuantity)
    const price = parseFloat(bundlePrice)
    if (quantity > 0 && price > 0) {
      onFormDataChange({
        ...formData,
        bundle_pricing: [...formData.bundle_pricing, { quantity, price }],
      })
      setBundleQuantity('')
      setBundlePrice('')
    }
  }

  const removeBundle = (index: number) => {
    onFormDataChange({
      ...formData,
      bundle_pricing: formData.bundle_pricing.filter((_, i) => i !== index),
    })
  }

  const addVariant = () => {
    const price = variantPrice ? parseFloat(variantPrice) : null
    const stock = parseInt(variantStock) || 0
    if (variantName.trim()) {
      const newVariant: ProductVariant = {
        id: `temp-${Date.now()}`,
        product_id: productId,
        name: variantName.trim(),
        price,
        stock,
        created_at: new Date().toISOString(),
      }
      onFormDataChange({
        ...formData,
        variants: [...formData.variants, newVariant],
      })
      setVariantName('')
      setVariantPrice('')
      setVariantStock('')
    }
  }

  const removeVariant = (variantId: string) => {
    onFormDataChange({
      ...formData,
      variants: formData.variants.filter(v => v.id !== variantId),
    })
  }

  const SectionHeader = ({ 
    title, 
    section, 
    count 
  }: { 
    title: string
    section: keyof typeof expandedSections
    count?: number 
  }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {count !== undefined && count > 0 && (
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            {count}
          </span>
        )}
      </div>
      <svg
        className={`w-5 h-5 text-gray-500 transition-transform ${
          expandedSections[section] ? 'rotate-180' : ''
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <SectionHeader title="Basic Information" section="basic" />
        {expandedSections.basic && (
          <div className="p-6 space-y-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => onFormDataChange({ ...formData, slug: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Auto-generated from name"
              />
              <p className="mt-1 text-xs text-gray-500">
                Used in the product URL. Leave empty to auto-generate.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter product description"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => onFormDataChange({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Featured Product</span>
              </label>
              <p className="mt-1 text-xs text-gray-500 ml-6">
                Featured products appear prominently on the homepage
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Pricing & Stock */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <SectionHeader 
          title="Pricing & Stock" 
          section="pricing"
          count={formData.bundle_pricing.length > 0 ? formData.bundle_pricing.length : undefined}
        />
        {expandedSections.pricing && (
          <div className="p-6 space-y-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Regular Price (XOF) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => onFormDataChange({ ...formData, price: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  onChange={(e) => onFormDataChange({ ...formData, promo_price: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) => onFormDataChange({ ...formData, stock: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Bundle Pricing */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Bundle Pricing</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    min="1"
                    value={bundleQuantity}
                    onChange={(e) => setBundleQuantity(e.target.value)}
                    placeholder="Quantity"
                    className="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={bundlePrice}
                    onChange={(e) => setBundlePrice(e.target.value)}
                    placeholder="Price (XOF)"
                    className="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <Button type="button" onClick={addBundle} variant="outline" className="w-full sm:w-auto">
                  Add Bundle Option
                </Button>
                {formData.bundle_pricing.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {formData.bundle_pricing.map((bundle, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="text-sm font-medium text-gray-700">
                          {bundle.quantity}x for {formatPrice(bundle.price)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeBundle(idx)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Variants */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <SectionHeader 
          title="Product Variants" 
          section="variants"
          count={formData.variants.length}
        />
        {expandedSections.variants && (
          <div className="p-6 border-t border-gray-200 space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Variant Name *
                  </label>
                  <input
                    type="text"
                    value={variantName}
                    onChange={(e) => setVariantName(e.target.value)}
                    placeholder="e.g., Small, Red, 500g"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (XOF) - Optional
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={variantPrice}
                    onChange={(e) => setVariantPrice(e.target.value)}
                    placeholder="Leave empty to use product price"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock *
                  </label>
                  <input
                    type="number"
                    value={variantStock}
                    onChange={(e) => setVariantStock(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <Button type="button" onClick={addVariant} variant="outline" className="w-full sm:w-auto">
                Add Variant
              </Button>
            </div>
            {formData.variants.length > 0 && (
              <div className="space-y-2 mt-4">
                {formData.variants.map((variant) => (
                  <div key={variant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-700">{variant.name}</span>
                      <div className="flex gap-4 mt-1 text-xs text-gray-600">
                        <span>Price: {variant.price !== null ? formatPrice(variant.price) : 'Product price'}</span>
                        <span>Stock: {variant.stock}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariant(variant.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500">
              Variants allow customers to choose different options (size, color, etc.) for this product.
            </p>
          </div>
        )}
      </div>

      {/* Product Images */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <SectionHeader 
          title="Product Images (Gallery)" 
          section="images"
          count={formData.images.split('\n').filter(Boolean).length}
        />
        {expandedSections.images && (
          <div className="p-6 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URLs (one per line)
            </label>
            <textarea
              value={formData.images}
              onChange={(e) => onFormDataChange({ ...formData, images: e.target.value })}
              rows={6}
              className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            />
            <p className="mt-2 text-xs text-gray-500">
              Enter image URLs, one per line. These images will appear in the product gallery on the product page.
            </p>
          </div>
        )}
      </div>

      {/* Assets */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <SectionHeader 
          title="Assets (Images & Videos for Page Content)" 
          section="assets"
          count={formData.assets.length}
        />
        {expandedSections.assets && (
          <div className="p-6 border-t border-gray-200 space-y-4">
            <FileUploader
              productId={productId}
              files={formData.assets}
              onFilesChange={(files) => onFormDataChange({ ...formData, assets: files })}
              label="Upload Assets"
              maxFiles={50}
              showPreview={false}
            />
            {formData.assets.length > 0 && (
              <AssetsGallery assets={formData.assets} />
            )}
          </div>
        )}
      </div>

      {/* Page Content */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <SectionHeader title="Page Content Editor" section="content" />
        {expandedSections.content && (
          <div className="p-6 border-t border-gray-200">
            <PageContentEditor
              value={formData.page_content}
              onChange={(value) => onFormDataChange({ ...formData, page_content: value })}
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={saving}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={saving}
            className="w-full sm:w-auto"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}

