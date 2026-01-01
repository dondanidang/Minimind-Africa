import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

const JEKO_WEBHOOK_SECRET = process.env.JEKO_WEBHOOK_SECRET

// Interface for Jeko webhook payload based on official documentation
interface JekoWebhookPayload {
  id: string
  amount: {
    amount: number
    currency: string
  }
  fees: {
    amount: number
    currency: string
  }
  status: 'success' | 'error'
  counterpartLabel: string
  counterpartIdentifier: string
  paymentMethod: 'wave' | 'orange' | 'mtn' | 'moov' | 'djamo' | 'bank' | 'civ_wave' | 'civ_orange_money' | 'civ_mtn_momo' | 'civ_moov'
  transactionType: 'payment' | 'transfer'
  businessName: string
  storeName: string
  description: string
  executedAt: string
  transactionDetails: {
    id?: string
    reference?: string
    paymentLinkId?: string
  }
}

/**
 * Verify Jeko webhook signature using HMAC-SHA256
 * Based on Jeko documentation: https://developer.jeko.africa/fr/integration/webhooks/integration
 * 
 * @param rawBody Raw request body as string (must be unparsed JSON string)
 * @param signature Signature from Jeko-Signature header
 * @param secret Webhook secret from Jeko Cockpit
 * @returns boolean indicating if signature is valid
 */
function verifySignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  try {
    // Calculate HMAC-SHA256 of the raw body
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(rawBody)
    const calculatedSignature = hmac.digest('hex')
    
    // Remove common prefixes if present (e.g., "sha256=")
    const cleanSignature = signature.replace(/^(sha256|hex)=/i, '').trim()
    
    // Compare signatures using timing-safe comparison to prevent timing attacks
    // Standard HMAC-SHA256 signatures are hex-encoded (64 characters)
    if (cleanSignature.length !== calculatedSignature.length) {
      return false
    }
    
    // Compare as hex strings (most common format for HMAC-SHA256)
    return crypto.timingSafeEqual(
      Buffer.from(cleanSignature, 'hex'),
      Buffer.from(calculatedSignature, 'hex')
    )
  } catch (error) {
    console.error('Signature verification error:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text()
    
    // Get signature from header
    const signature = request.headers.get('Jeko-Signature')
    
    // Verify signature if secret is configured
    if (JEKO_WEBHOOK_SECRET) {
      if (!signature) {
        console.error('Missing Jeko-Signature header')
        return NextResponse.json({ received: true, message: 'Missing signature header' })
      }
      
      const isValid = verifySignature(rawBody, signature, JEKO_WEBHOOK_SECRET)
      if (!isValid) {
        console.error('Invalid webhook signature')
        return NextResponse.json({ received: true, message: 'Invalid signature' })
      }
    } else {
      console.warn('JEKO_WEBHOOK_SECRET not configured - skipping signature verification')
    }
    
    // Parse JSON payload
    const payload: JekoWebhookPayload = JSON.parse(rawBody)
    
    // Log webhook for debugging
    console.log('Jeko webhook received:', JSON.stringify(payload, null, 2))
    
    // Only process transaction.completed events (as per Jeko documentation)
    // Note: Jeko documentation indicates only transaction.completed is sent
    // So we process all webhooks as transaction.completed events
    
    // Only process payment transactions (not transfers)
    if (payload.transactionType !== 'payment') {
      console.log(`Ignoring non-payment transaction: ${payload.transactionType}`)
      return NextResponse.json({ received: true, message: 'Non-payment transaction ignored' })
    }
    
    // Only process successful transactions
    if (payload.status !== 'success') {
      console.log(`Transaction status is not success: ${payload.status}`)
      // Store webhook but don't update order status
      // Return 200 to acknowledge receipt
      return NextResponse.json({ received: true, message: 'Transaction not successful' })
    }
    
    const supabase = await createClient()
    
    // Extract paymentLinkId from transactionDetails
    const paymentLinkId = payload.transactionDetails.paymentLinkId
    
    if (!paymentLinkId) {
      console.error('Missing paymentLinkId in transactionDetails')
      return NextResponse.json({ received: true, message: 'Missing paymentLinkId in transactionDetails' })
    }
    
    // Find order by payment_link_id stored in payment_data JSONB column
    // Using JSONB path operator (->>) to filter directly in the database
    const { data: order, error: findError } = await supabase
      .from('orders')
      .select('*')
      .eq('payment_status', 'pending')
      .filter('payment_data->>payment_link_id', 'eq', paymentLinkId)
      .maybeSingle()
    
    if (findError) {
      console.error('Error finding order:', findError)
      return NextResponse.json({ received: true, message: 'Error finding order' })
    }
    
    if (!order) {
      console.error('Order not found for paymentLinkId:', paymentLinkId)
      // Return 200 to acknowledge webhook even if order not found
      // This prevents Jeko from retrying
      return NextResponse.json({ received: true, message: 'Order not found' })
    }
    
    // Prepare updated payment_data with webhook
    const currentPaymentData = order.payment_data || {
    }
    
    // Save the full webhook payload when marking order as successful
    const updatedPaymentData = {
      ...currentPaymentData,
      webhooks: {
        ...payload,
        received_at: new Date().toISOString(),
      },
    }
    
    // Update order status to paid (transaction is successful and is a payment)
    // Also save the webhook data in payment_data
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        status: 'processing',
        payment_data: updatedPaymentData,
      })
      .eq('id', order.id)
    
    if (updateError) {
      console.error('Error updating order:', updateError)
      // Return 200 to acknowledge webhook even if update fails
      // This prevents Jeko from retrying and logging helps with debugging
      return NextResponse.json(
        { 
          received: true, 
          message: 'Webhook received but failed to update order',
          error: updateError.message
        },
        { status: 200 }
      )
    }
    
    console.log(`Order ${order.id} marked as paid`)
    
    // Return 200 within 5 seconds as per Jeko requirements
    return NextResponse.json({ 
      received: true, 
      orderId: order.id,
      status: 'updated'
    })
  } catch (error: any) {
    console.error('Webhook error:', error)
    // Return 200 to acknowledge webhook even on error
    // This prevents Jeko from retrying if it's a processing error
    // Only return error status for authentication/signature issues
    return NextResponse.json(
      { received: true, error: error?.message || 'Internal server error' },
      { status: 200 }
    )
  }
}
