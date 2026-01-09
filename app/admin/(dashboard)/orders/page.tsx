'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { Order } from '@/types/order'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const supabase = createClient()

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  const fetchOrders = async () => {
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (statusFilter) {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching orders:', error)
        setOrders([])
        return
      }

      if (Array.isArray(data)) {
        setOrders(data)
      } else {
        console.error('Invalid response format:', data)
        setOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No orders found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{order.order_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div>{order.customer_email}</div>
                    {order.customer_name && (
                      <div className="text-gray-500">{order.customer_name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/admin/orders/${order.id}`} className="text-primary-600 hover:text-primary-900">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">No orders found.</div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{order.order_number}</h3>
                  <p className="text-xs text-gray-600">{order.customer_email}</p>
                  {order.customer_name && (
                    <p className="text-xs text-gray-500">{order.customer_name}</p>
                  )}
                </div>
                <Link href={`/admin/orders/${order.id}`} className="text-primary-600 hover:text-primary-900 text-sm font-medium ml-4">
                  View
                </Link>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-medium">{formatPrice(order.total)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment:</span>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.payment_status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="text-gray-500">{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

