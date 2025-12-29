import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const JEKO_API_URL = 'https://api.jeko.africa/partner_api/payment_links'
const JEKO_API_KEY = process.env.JEKO_API_KEY
const JEKO_API_KEY_ID = process.env.JEKO_API_KEY_ID
const JEKO_STORE_ID = process.env.JEKO_STORE_ID

export async function POST(request: Request) {
  try {
    if (!JEKO_API_KEY || !JEKO_API_KEY_ID || !JEKO_STORE_ID) {
      return NextResponse.json(
        { error: 'Jeko API credentials not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing required field: orderId' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Fetch order with items
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Fetch order items to build payment title
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)

    if (itemsError) {
      return NextResponse.json(
        { error: 'Failed to fetch order items' },
        { status: 500 }
      )
    }

    // Build payment title with product names and quantities
    // Pattern: "Product Name (qty) x Product Name (qty) - Commande #12345"
    // Limit title to 255 characters (Jeko requirement: 10-255 characters)
    const productTitles = (orderItems || []).map((item: any) => {
      return `${item.product_name} (${item.quantity})`
    })
    let paymentTitle = `${productTitles.join(' x ')} - Commande #${order.order_number}`
    
    // Truncate if too long (keep at least order number visible)
    const maxLength = 255
    const orderSuffix = ` - Commande #${order.order_number}`
    if (paymentTitle.length > maxLength) {
      const availableLength = maxLength - orderSuffix.length
      const truncatedProducts = productTitles.join(' x ').substring(0, availableLength - 3) + '...'
      paymentTitle = `${truncatedProducts}${orderSuffix}`
    }

    // Convert amount to cents (XOF)
    // Assuming total is stored as a number (already in the smallest currency unit or needs conversion)
    // If total is in XOF, multiply by 100 to get cents
    const amountCents = Math.round(Number(order.total) * 100)

    // Check if payment link already exists
    if (order.payment_data?.payment_link_url) {
      // Return existing payment link
      return NextResponse.json({
        paymentLink: {
          link: order.payment_data.payment_link_url,
          id: order.payment_data.payment_link_id,
        }
      })
    }

    // Create Jeko payment link
    const jekoResponse = await fetch(JEKO_API_URL, {
      method: 'POST',
      headers: {
        'X-API-KEY': JEKO_API_KEY,
        'X-API-KEY-ID': JEKO_API_KEY_ID,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        storeId: JEKO_STORE_ID,
        title: paymentTitle,
        amountCents: amountCents,
        currency: 'XOF',
        allowMultiplePayments: false, // Single use link
      }),
    })

    if (!jekoResponse.ok) {
      const error = await jekoResponse.json()
      console.error('Jeko API error:', error)
      return NextResponse.json(
        { error: 'Failed to create payment link', details: error },
        { status: 500 }
      )
    }

    const paymentLink = await jekoResponse.json()

    // Store payment link data in order
    const paymentData = {
      payment_link_url: paymentLink.link,
      payment_link_id: paymentLink.id,
      webhooks: [],
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_data: paymentData,
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('Error updating order with payment data:', updateError)
      // Don't fail the request, payment link was created successfully
    }

    return NextResponse.json({ paymentLink })
  } catch (error: any) {
    console.error('Payment link creation error:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

