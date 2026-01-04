import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const JEKO_API_URL = 'https://api.jeko.africa/partner_api/payment_requests'
const JEKO_API_KEY = process.env.JEKO_API_KEY
const JEKO_API_KEY_ID = process.env.JEKO_API_KEY_ID
const JEKO_STORE_ID = process.env.JEKO_STORE_ID
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export async function POST(request: Request) {
  try {
    if (!JEKO_API_KEY || !JEKO_API_KEY_ID || !JEKO_STORE_ID) {
      return NextResponse.json(
        { error: 'Jeko API credentials not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { orderId, paymentMethod } = body

    if (!orderId || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId and paymentMethod' },
        { status: 400 }
      )
    }

    // Validate payment method
    const validMethods = ['wave', 'orange', 'mtn', 'moov', 'djamo']
    if (!validMethods.includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Fetch order
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

    // Convert amount to cents (XOF)
    const amountCents = Math.round(Number(order.total) * 100)

    // Build success and error URLs with order reference
    const successUrl = `${BASE_URL}/checkout/success?reference=${order.order_number}&order=${order.id}`
    const errorUrl = `${BASE_URL}/checkout/error?reference=${order.order_number}&order=${order.id}`

    // Create Jeko payment request with redirect type
    const jekoResponse = await fetch(JEKO_API_URL, {
      method: 'POST',
      headers: {
        'X-API-KEY': JEKO_API_KEY,
        'X-API-KEY-ID': JEKO_API_KEY_ID,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        storeId: JEKO_STORE_ID,
        amountCents: amountCents,
        currency: 'XOF',
        reference: order.order_number,
        paymentDetails: {
          type: 'redirect',
          data: {
            paymentMethod: paymentMethod,
            successUrl: successUrl,
            errorUrl: errorUrl,
          },
        },
      }),
    })

    if (!jekoResponse.ok) {
      const error = await jekoResponse.json()
      console.error('Jeko API error:', error)
      return NextResponse.json(
        { error: 'Failed to create payment request', details: error },
        { status: 500 }
      )
    }

    const paymentRequest = await jekoResponse.json()

    // Store payment request data in order
    const paymentData = {
      ...(order.payment_data || {}),
      payment_request_id: paymentRequest.id,
      payment_method: paymentMethod,
      redirect_url: paymentRequest.redirectUrl,
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_data: paymentData,
        payment_method: paymentMethod,
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('Error updating order with payment data:', updateError)
      // Still return the redirect URL, but log the error
    }

    return NextResponse.json({
      paymentRequest: {
        id: paymentRequest.id,
        redirectUrl: paymentRequest.redirectUrl,
      },
    })
  } catch (error: any) {
    console.error('Payment request creation error:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

