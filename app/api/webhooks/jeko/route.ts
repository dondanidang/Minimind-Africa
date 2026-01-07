import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

const JEKO_WEBHOOK_SECRET = process.env.JEKO_WEBHOOK_SECRET
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM
const DANIEL_WHATSAPP = process.env.DANIEL_WHATSAPP
const PHILIPPE_WHATSAPP = process.env.PHILIPPE_WHATSAPP

// WhatsApp Template Content SIDs (from Twilio Content Template Builder)
// These templates must be pre-approved by WhatsApp
const TWILIO_WHATSAPP_TEMPLATE_CUSTOMER_CONFIRMATION = process.env.TWILIO_WHATSAPP_TEMPLATE_CUSTOMER_CONFIRMATION
const TWILIO_WHATSAPP_TEMPLATE_ADMIN_NOTIFICATION = process.env.TWILIO_WHATSAPP_TEMPLATE_ADMIN_NOTIFICATION

// Admin phone numbers for order notifications
const ADMIN_PHONE_NUMBERS = [
  DANIEL_WHATSAPP,
  PHILIPPE_WHATSAPP,
].filter(Boolean) as string[] // Filter out undefined values

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
    paymentRequestId?: string
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

/**
 * Send WhatsApp message using template (Content SID)
 * @param client Twilio client
 * @param toNumber Recipient WhatsApp number
 * @param contentSid Content Template SID
 * @param contentVariables Template variables as object
 * @returns Promise with Twilio message result
 */
async function sendWhatsAppTemplate(
  client: any,
  toNumber: string,
  contentSid: string,
  contentVariables: Record<string, string>
): Promise<any> {
  return await client.messages.create({
    from: TWILIO_WHATSAPP_FROM,
    to: toNumber,
    contentSid: contentSid,
    contentVariables: JSON.stringify(contentVariables),
  })
}

/**
 * Send WhatsApp payment confirmation message via Twilio
 * Uses template if configured, otherwise falls back to freeform message
 * @param order Order object with customer information
 * @param amount Amount in XOF (from webhook payload)
 * @returns Promise with Twilio message result or null if failed/skipped
 */
async function sendWhatsAppConfirmation(order: any, amount: number): Promise<any> {
  // Check if Twilio is configured
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM) {
    console.warn('Twilio credentials not configured - skipping WhatsApp notification')
    return null
  }

  // Check if customer has phone number
  if (!order.customer_phone) {
    console.warn('No customer phone number - skipping WhatsApp notification')
    return null
  }

  // Dynamically import Twilio to avoid requiring it if not configured
  const twilio = await import('twilio')
  const client = twilio.default(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
  
  // Format phone number
  // Remove spaces and any existing + prefix
  let phoneNumber = order.customer_phone.replace(/\s+/g, '').replace(/^\+/, '')
  
  // If phone doesn't start with country code, assume Côte d'Ivoire (+225)
  if (!phoneNumber.startsWith('225')) {
    phoneNumber = '225' + phoneNumber
  }
  
  const toNumber = `whatsapp:+${phoneNumber}`

  // Format amount in XOF (convert from cents if needed)
  const amountInXOF = amount / 100

  // Try to use template if configured
  if (TWILIO_WHATSAPP_TEMPLATE_CUSTOMER_CONFIRMATION) {
    // Template format:
    // ✅ Paiement confirmé!
    // Votre commande {{1}} a été payée avec succès.
    // Montant: {{2}} XOF
    // Nous traiterons votre commande sous peu et vous contacterons pour la livraison.
    // Merci pour votre achat! 🎉
    const contentVariables = {
      '1': `#${order.order_number}`, // Order number with # prefix
      '2': `${amountInXOF.toLocaleString('fr-FR')} XOF`, // Amount formatted
    }

    try {
      const result = await sendWhatsAppTemplate(
        client,
        toNumber,
        TWILIO_WHATSAPP_TEMPLATE_CUSTOMER_CONFIRMATION,
        contentVariables
      )
      console.log('WhatsApp template confirmation sent successfully:', result.sid)
      return result
    } catch (templateError: any) {
      console.warn('Template message failed:', templateError.message)
      // Fall through to freeform message
    }
  }
}

/**
 * Send WhatsApp notification to administrators about new sale
 * @param order Order object with customer information
 * @param orderItems Array of order items
 * @param amount Amount in XOF (from webhook payload)
 * @returns Promise with results for each admin notification
 */
async function sendAdminNotifications(order: any, orderItems: any[], amount: number): Promise<any[]> {
  // Check if Twilio is configured
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM) {
    console.warn('Twilio credentials not configured - skipping admin notifications')
    return []
  }

  if (ADMIN_PHONE_NUMBERS.length === 0) {
    console.warn('No admin phone numbers configured')
    return []
  }

  try {
    const twilio = await import('twilio')
    const client = twilio.default(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    
    // Format order items summary
    const itemsSummary = orderItems.map(item => {
      const itemTotal = item.product_price * item.quantity
      return `• ${item.product_name} x${item.quantity} - ${itemTotal.toLocaleString('fr-FR')} XOF`
    }).join('\n')

    // Format shipping address
    const shippingAddress = typeof order.shipping_address === 'string' 
      ? order.shipping_address 
      : order.shipping_address 
        ? `${order.shipping_address.street || ''}, ${order.shipping_address.city || ''}`.trim()
        : 'Non spécifiée'

    // Send to all admin numbers
    const results = await Promise.allSettled(
      ADMIN_PHONE_NUMBERS.map(async (phoneNumber, index) => {
        // Format phone number (ensure it starts with +)
        const formattedNumber = phoneNumber.startsWith('+') 
          ? phoneNumber 
          : `+${phoneNumber}`
        const toNumber = `whatsapp:${formattedNumber}`

        try {
          // Try to use template if configured
          if (TWILIO_WHATSAPP_TEMPLATE_ADMIN_NOTIFICATION) {
            // Template format:
            // 🛒 NOUVELLE VENTE
            // Commande: {{1}}
            // 👤 CLIENT
            // Nom: {{2}}
            // Téléphone: {{3}}
            // Adresse: {{4}}
            // 📦 ARTICLES
            // {{5}}
            // Go to Admin dashboard for more info.
            const contentVariables = {
              '1': `#${order.order_number}`, // Order number with # prefix
              '2': order.customer_name || 'Non spécifié', // Customer name
              '3': order.customer_phone || 'Non spécifié', // Customer phone
              '4': shippingAddress, // Shipping address
              '5': itemsSummary, // Items summary (formatted list)
            }

            const result = await sendWhatsAppTemplate(
              client,
              toNumber,
              TWILIO_WHATSAPP_TEMPLATE_ADMIN_NOTIFICATION,
              contentVariables
            )
            console.log(`Admin template notification sent to ${formattedNumber}:`, result.sid)
            return { phoneNumber: formattedNumber, result }
          }
        } catch (error: any) {
          console.error(`Error sending admin notification to ${formattedNumber}:`, error.message)
          // Don't fail the webhook if admin notification fails
          return { 
            phoneNumber: formattedNumber, 
            error: error.message,
            reason: 'error_sending_notification',
            skipped: true 
          }
        }
      })
    )

    // Log any failures or skipped messages
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Failed to send admin notification to ${ADMIN_PHONE_NUMBERS[index]}:`, result.reason)
      } else if (result.status === 'fulfilled' && result.value?.skipped) {
        const reason = result.value.reason || 'unknown'
        const errorMsg = result.value.error ? ` - ${result.value.error}` : ''
        console.warn(`Skipped admin notification to ${ADMIN_PHONE_NUMBERS[index]}: ${reason}${errorMsg}`)
      }
    })

    return results.map(r => r.status === 'fulfilled' ? r.value : null).filter(Boolean)
  } catch (error: any) {
    console.error('Error sending admin notifications:', error.message || error)
    return []
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
    
    // Extract payment request ID or payment link ID from transactionDetails
    // Support both redirect payment requests and payment links
    // The 'id' field in transactionDetails may be the payment request ID for redirect payments
    const paymentRequestId = payload.transactionDetails.paymentRequestId || payload.transactionDetails.id
    const paymentLinkId = payload.transactionDetails.paymentLinkId
    const reference = payload.transactionDetails.reference
    
    // Try to find order by payment_request_id first (for redirect payments)
    // Then fallback to payment_link_id (for payment link payments)
    let order = null
    let findError = null
    
    if (paymentRequestId) {
      const result = await supabase
        .from('orders')
        .select('*')
        .eq('payment_status', 'pending')
        .filter('payment_data->>payment_request_id', 'eq', paymentRequestId)
        .maybeSingle()
      order = result.data
      findError = result.error
    }
    
    // Fallback to payment_link_id if not found
    if (!order && paymentLinkId) {
      const result = await supabase
        .from('orders')
        .select('*')
        .eq('payment_status', 'pending')
        .filter('payment_data->>payment_link_id', 'eq', paymentLinkId)
        .maybeSingle()
      order = result.data
      findError = result.error
    }
    
    // If still not found, try to find by reference (order number)
    if (!order && reference) {
      const result = await supabase
        .from('orders')
        .select('*')
        .eq('payment_status', 'pending')
        .eq('order_number', reference)
        .maybeSingle()
      order = result.data
      findError = result.error
    }
    
    if (!paymentRequestId && !paymentLinkId && !reference) {
      console.error('Missing payment identifier in transactionDetails')
      return NextResponse.json({ received: true, message: 'Missing payment identifier in transactionDetails' })
    }
    
    if (findError) {
      console.error('Error finding order:', findError)
      return NextResponse.json({ received: true, message: 'Error finding order' })
    }
    
    if (!order) {
      console.error('Order not found for payment request/link ID:', paymentRequestId || paymentLinkId)
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
    
    // Fetch order items for admin notification
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id)

    if (itemsError) {
      console.error('Error fetching order items for admin notification:', itemsError)
    }
    
    // Send WhatsApp confirmation to customer (non-blocking - don't await to avoid delaying webhook response)
    sendWhatsAppConfirmation(order, payload.amount.amount).catch(err => {
      console.error('WhatsApp confirmation error (non-blocking):', err)
    })
    
    // Send admin notifications with order summary (non-blocking)
    if (orderItems && orderItems.length > 0) {
      sendAdminNotifications(order, orderItems, payload.amount.amount).catch(err => {
        console.error('Admin notifications error (non-blocking):', err)
      })
    }
    
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
