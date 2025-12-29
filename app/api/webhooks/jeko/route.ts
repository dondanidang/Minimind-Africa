import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Log webhook for debugging
    console.log('Jeko webhook received:', JSON.stringify(body, null, 2))
    
    // Extract webhook data
    // Adjust these fields based on Jeko's actual webhook payload structure
    const {
      event, // e.g., 'payment.completed', 'payment.success'
      payment_link_id,
      payment_link,
      amount,
      currency,
      // ... other fields from Jeko webhook
    } = body

    const supabase = await createClient()
    
    // Find order by payment_link_id stored in payment_data
    const { data: orders, error: findError } = await supabase
      .from('orders')
      .select('*')
      .eq('payment_status', 'pending')

    if (findError) {
      console.error('Error finding orders:', findError)
      return NextResponse.json(
        { error: 'Failed to find order' },
        { status: 500 }
      )
    }

    // Find the order that matches the payment_link_id
    const order = orders?.find((o: any) => 
      o.payment_data?.payment_link_id === payment_link_id ||
      o.payment_data?.payment_link_url === payment_link
    )

    if (!order) {
      console.error('Order not found for payment_link_id:', payment_link_id)
      // Return 200 to acknowledge webhook even if order not found
      // This prevents Jeko from retrying
      return NextResponse.json({ received: true, message: 'Order not found' })
    }

    // Prepare updated payment_data with webhook
    const currentPaymentData = order.payment_data || {
      payment_link_url: null,
      payment_link_id: null,
      webhooks: [],
    }

    const updatedPaymentData = {
      ...currentPaymentData,
      webhooks: [
        ...(currentPaymentData.webhooks || []),
        {
          ...body,
          received_at: new Date().toISOString(),
        },
      ],
    }

    // Update order based on webhook event
    if (event === 'payment.completed' || event === 'payment.success') {
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          status: 'processing', // or 'confirmed'
          payment_data: updatedPaymentData,
        })
        .eq('id', order.id)

      if (updateError) {
        console.error('Error updating order:', updateError)
        return NextResponse.json(
          { error: 'Failed to update order' },
          { status: 500 }
        )
      }

      console.log(`Order ${order.id} marked as paid`)
    } else {
      // For other events, just store the webhook without changing status
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          payment_data: updatedPaymentData,
        })
        .eq('id', order.id)

      if (updateError) {
        console.error('Error updating order with webhook:', updateError)
        return NextResponse.json(
          { error: 'Failed to update order' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ received: true, orderId: order.id })
  } catch (error: any) {
    console.error('Webhook error:', error)
    // Return 200 to acknowledge webhook even on error
    // This prevents Jeko from retrying if it's a processing error
    return NextResponse.json(
      { received: true, error: error?.message || 'Internal server error' },
      { status: 200 }
    )
  }
}

