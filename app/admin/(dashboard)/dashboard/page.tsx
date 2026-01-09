import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'

async function getStats() {
  const supabase = await createClient()
  
  const [ordersResult, productsResult, totalRevenueResult] = await Promise.all([
    supabase.from('orders').select('id', { count: 'exact', head: true }),
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('total').eq('payment_status', 'paid'),
  ])

  const totalRevenue = totalRevenueResult.data?.reduce((sum, order) => sum + Number(order.total), 0) || 0
  const pendingOrders = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')

  return {
    totalOrders: ordersResult.count || 0,
    totalProducts: productsResult.count || 0,
    totalRevenue,
    pendingOrders: pendingOrders.count || 0,
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats()

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Total Orders</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Total Products</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Total Revenue</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{formatPrice(stats.totalRevenue)}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Pending Orders</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingOrders}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/products" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold mb-2">Manage Products</h2>
          <p className="text-gray-600">Add, edit, or remove products</p>
        </Link>
        <Link href="/admin/orders" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold mb-2">Manage Orders</h2>
          <p className="text-gray-600">View and update order status</p>
        </Link>
      </div>
    </div>
  )
}

