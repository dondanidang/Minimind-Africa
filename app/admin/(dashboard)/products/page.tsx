'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/types/product'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching products:', error)
        setProducts([])
        return
      }
      
      if (Array.isArray(data)) {
        setProducts(data)
      } else {
        console.error('Invalid response format:', data)
        setProducts([])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting product:', error)
        alert('Error deleting product')
        return
      }

      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error deleting product')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button className="w-full sm:w-auto">Add Product</Button>
        </Link>
      </div>

      {/* Desktop Table View - Only show on screens 1600px and wider */}
      <div className="hidden admin-lg:block bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Promo Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bundle Pricing</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                    {product.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatPrice(Number(product.price))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {product.promo_price ? (
                      <span className="text-red-600 font-semibold">{formatPrice(Number(product.promo_price))}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {product.bundle_pricing && Array.isArray(product.bundle_pricing) && product.bundle_pricing.length > 0 ? (
                      <div className="space-y-1">
                        {product.bundle_pricing.map((bundle, idx) => (
                          <div key={idx} className="text-xs">
                            {bundle.quantity}x: {formatPrice(Number(bundle.price))}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link href={`/admin/products/${product.id}/edit`} className="text-primary-600 hover:text-primary-900">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View - Show on all screens below 1600px */}
      <div className="block admin-lg:hidden space-y-4">
        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-sm text-gray-500">
            No products found
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-xs font-mono text-gray-500">{product.id.substring(0, 8)}...</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Link href={`/admin/products/${product.id}/edit`} className="text-primary-600 hover:text-primary-900 text-sm font-medium">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">{formatPrice(Number(product.price))}</span>
                </div>
                {product.promo_price && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Promo Price:</span>
                    <span className="text-red-600 font-semibold">{formatPrice(Number(product.promo_price))}</span>
                  </div>
                )}
                {product.bundle_pricing && Array.isArray(product.bundle_pricing) && product.bundle_pricing.length > 0 && (
                  <div>
                    <span className="text-gray-600">Bundle Pricing:</span>
                    <div className="mt-1 space-y-1">
                      {product.bundle_pricing.map((bundle, idx) => (
                        <div key={idx} className="text-xs text-gray-700">
                          {bundle.quantity}x: {formatPrice(Number(bundle.price))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

