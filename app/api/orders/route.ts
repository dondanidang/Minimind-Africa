import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Order } from '@/types/order'

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    const {
      customer_email,
      customer_name,
      customer_phone,
      shipping_address,
      items,
      payment_method,
    } = body

    // Validate required fields
    if (!customer_email || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: customer_email and items are required' },
        { status: 400 }
      )
    }

    // Calculate total
    const total = items.reduce((sum: number, item: any) => {
      return sum + (item.product_price || 0) * (item.quantity || 0)
    }, 0)

    // Get user if authenticated
    const { data: { user } } = await supabase.auth.getUser()

    // Create order
    const orderNumber = generateOrderNumber()
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: user?.id || null,
        customer_email,
        customer_name: customer_name || null,
        customer_phone: customer_phone || null,
        shipping_address: shipping_address || null,
        total,
        payment_method: payment_method || null,
        status: 'pending',
        payment_status: 'pending',
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order creation error:', orderError)
      return NextResponse.json(
        { error: orderError.message, details: orderError },
        { status: 500 }
      )
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_price: item.product_price,
      quantity: item.quantity,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Order items creation error:', itemsError)
      // Rollback order creation if items fail
      await supabase.from('orders').delete().eq('id', order.id)
      return NextResponse.json(
        { error: itemsError.message, details: itemsError },
        { status: 500 }
      )
    }

    return NextResponse.json({ order: order as Order, order_number: orderNumber })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error', details: error },
      { status: 500 }
    )
  }
}

