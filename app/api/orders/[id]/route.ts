import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Order, OrderItem } from '@/types/order'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Fetch order with order items
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', params.id)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Fetch order items
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', params.id)
      .order('created_at', { ascending: true })

    if (itemsError) {
      console.error('Error fetching order items:', itemsError)
    }

    return NextResponse.json({ 
      order: {
        ...order,
        order_items: (orderItems as OrderItem[]) || []
      } as Order & { order_items: OrderItem[] }
    })
  } catch (error: any) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

