'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import type { Order, OrderItem } from '@/types/order'

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [status, setStatus] = useState<string>('')

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (orderError) {
        console.error('Error fetching order:', orderError)
        alert('Error loading order')
        return
      }

      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId)

      if (itemsError) {
        console.error('Error fetching order items:', itemsError)
        alert('Error loading order items')
        return
      }

      setOrder(orderData)
      setItems(itemsData || [])
      setStatus(orderData.status)
    } catch (error) {
      console.error('Error fetching order:', error)
      alert('Error loading order')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)
        .select()
        .single()

      if (error) {
        console.error('Error updating order:', error)
        alert(error.message || 'Error updating order status')
        return
      }

      if (data) {
        setOrder(data)
        alert('Order status updated')
      }
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Error updating order status')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (!order) return <div>Order not found</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Order {order.order_number}</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back to Orders
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between border-b pb-4">
                  <div>
                    <div className="font-medium">{item.product_name}</div>
                    <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                  </div>
                  <div className="font-medium">{formatPrice(item.product_price * item.quantity)}</div>
                </div>
              ))}
              <div className="flex justify-between text-xl font-bold pt-4">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Button
                  onClick={handleStatusUpdate}
                  disabled={saving || status === order.status}
                  className="w-full mt-2"
                >
                  {saving ? 'Saving...' : 'Update Status'}
                </Button>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700">Payment Status</div>
                <div className="mt-1">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.payment_status}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700">Customer Email</div>
                <div className="mt-1 text-sm text-gray-900">{order.customer_email}</div>
              </div>

              {order.customer_name && (
                <div>
                  <div className="text-sm font-medium text-gray-700">Customer Name</div>
                  <div className="mt-1 text-sm text-gray-900">{order.customer_name}</div>
                </div>
              )}

              {order.customer_phone && (
                <div>
                  <div className="text-sm font-medium text-gray-700">Phone</div>
                  <div className="mt-1 text-sm text-gray-900">{order.customer_phone}</div>
                </div>
              )}

              {order.shipping_address && (
                <div>
                  <div className="text-sm font-medium text-gray-700">Shipping Address</div>
                  <div className="mt-1 text-sm text-gray-900">
                    {typeof order.shipping_address === 'object' 
                      ? JSON.stringify(order.shipping_address, null, 2)
                      : order.shipping_address}
                  </div>
                </div>
              )}

              <div>
                <div className="text-sm font-medium text-gray-700">Order Date</div>
                <div className="mt-1 text-sm text-gray-900">
                  {new Date(order.created_at).toLocaleString('fr-FR')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

