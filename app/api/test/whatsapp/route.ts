import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM
const DANIEL_WHATSAPP = process.env.DANIEL_WHATSAPP
const PHILIPPE_WHATSAPP = process.env.PHILIPPE_WHATSAPP
const TWILIO_WHATSAPP_TEMPLATE_CUSTOMER_CONFIRMATION = process.env.TWILIO_WHATSAPP_TEMPLATE_CUSTOMER_CONFIRMATION
const TWILIO_WHATSAPP_TEMPLATE_ADMIN_NOTIFICATION = process.env.TWILIO_WHATSAPP_TEMPLATE_ADMIN_NOTIFICATION

// Admin phone numbers for order notifications
const ADMIN_PHONE_NUMBERS = [
  DANIEL_WHATSAPP,
  PHILIPPE_WHATSAPP,
].filter(Boolean) as string[]

/**
 * GET endpoint to list recent orders for testing
 * Usage: GET /api/test/whatsapp
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: orders, error } = await supabase
      .from('orders')
      .select('id, order_number, customer_name, customer_phone, created_at, payment_status')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      return NextResponse.json(
        { error: 'Error fetching orders', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Recent orders (use orderId from here for testing)',
      orders: orders || [],
      usage: {
        customer: 'POST /api/test/whatsapp with { "type": "customer", "orderId": "..." }',
        admin: 'POST /api/test/whatsapp with { "type": "admin", "orderId": "..." }',
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Test endpoint to send WhatsApp messages directly
 * Usage: POST /api/test/whatsapp
 * Body: { type: 'customer' | 'admin', orderId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, orderId, phoneNumber } = body

    if (!type || !['customer', 'admin'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be "customer" or "admin"' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    if (type === 'customer') {
      // Test customer confirmation
      if (!orderId) {
        return NextResponse.json(
          { error: 'orderId required for customer test' },
          { status: 400 }
        )
      }

      // Fetch order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (orderError || !order) {
        return NextResponse.json(
          { error: 'Order not found', details: orderError },
          { status: 404 }
        )
      }

      // Test with actual order data
      const amount = 5000 // 50 XOF in cents (for testing)
      const result = await sendTestCustomerMessage(order, amount)

      return NextResponse.json({
        success: true,
        type: 'customer',
        result,
      })
    } else {
      // Test admin notifications
      if (!orderId) {
        return NextResponse.json(
          { error: 'orderId required for admin test' },
          { status: 400 }
        )
      }

      // Fetch order and items
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (orderError || !order) {
        return NextResponse.json(
          { error: 'Order not found', details: orderError },
          { status: 404 }
        )
      }

      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id)

      if (itemsError) {
        return NextResponse.json(
          { error: 'Error fetching order items', details: itemsError },
          { status: 500 }
        )
      }

      const amount = 5000 // 50 XOF in cents (for testing)
      const results = await sendTestAdminMessages(order, orderItems || [], amount)

      return NextResponse.json({
        success: true,
        type: 'admin',
        results,
      })
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error', details: error },
      { status: 500 }
    )
  }
}

/**
 * Test customer WhatsApp message
 */
async function sendTestCustomerMessage(order: any, amount: number): Promise<any> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM) {
    throw new Error('Twilio credentials not configured')
  }

  if (!order.customer_phone) {
    throw new Error('No customer phone number')
  }

  try {
    const twilio = await import('twilio')
    const client = twilio.default(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

    let phoneNumber = order.customer_phone.replace(/\s+/g, '').replace(/^\+/, '')
    if (!phoneNumber.startsWith('225')) {
      phoneNumber = '225' + phoneNumber
    }
    const toNumber = `whatsapp:+${phoneNumber}`

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
        const result = await client.messages.create({
          from: TWILIO_WHATSAPP_FROM,
          to: toNumber,
          contentSid: TWILIO_WHATSAPP_TEMPLATE_CUSTOMER_CONFIRMATION,
          contentVariables: JSON.stringify(contentVariables),
        })
        return { success: true, messageSid: result.sid, status: result.status, method: 'template' }
      } catch (templateError: any) {
        console.warn('Template message failed, falling back to freeform:', templateError.message)
        // Fall through to freeform
      }
    }

    // Fallback to freeform message
    const message = `✅ Paiement confirmé!

Votre commande #${order.order_number} a été payée avec succès.

Montant: ${amountInXOF.toLocaleString('fr-FR')} XOF

Nous traiterons votre commande sous peu et vous contacterons pour la livraison.

Merci pour votre achat! 🎉`

    const result = await client.messages.create({
      from: TWILIO_WHATSAPP_FROM,
      to: toNumber,
      body: message,
    })

    return { success: true, messageSid: result.sid, status: result.status }
  } catch (error: any) {
    // Handle error 63016: Outside 24-hour window
    if (error?.code === 63016) {
      return { 
        success: false, 
        error: 'outside_24h_window',
        message: 'Cannot send freeform message outside 24-hour window. Use WhatsApp message template instead.',
        errorCode: error.code,
        errorDetails: error.message
      }
    }
    
    throw error
  }
}

/**
 * Test admin WhatsApp messages
 */
async function sendTestAdminMessages(order: any, orderItems: any[], amount: number): Promise<any[]> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM) {
    throw new Error('Twilio credentials not configured')
  }

  if (ADMIN_PHONE_NUMBERS.length === 0) {
    throw new Error('No admin phone numbers configured')
  }

  try {
    const twilio = await import('twilio')
    const client = twilio.default(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

    const amountInXOF = amount / 100
    const itemsSummary = orderItems.map(item => {
      const itemTotal = item.product_price * item.quantity
      return `• ${item.product_name} x${item.quantity} - ${itemTotal.toLocaleString('fr-FR')} XOF`
    }).join('\n')

    const shippingAddress = typeof order.shipping_address === 'string'
      ? order.shipping_address
      : order.shipping_address
        ? `${order.shipping_address.street || ''}, ${order.shipping_address.city || ''}`.trim()
        : 'Non spécifiée'

    const message = `🛒 NOUVELLE VENTE

Commande: #${order.order_number}
Date: ${new Date(order.created_at).toLocaleString('fr-FR')}

👤 CLIENT
Nom: ${order.customer_name || 'Non spécifié'}
Téléphone: ${order.customer_phone || 'Non spécifié'}
Adresse: ${shippingAddress}

📦 ARTICLES
${itemsSummary}

💰 TOTAL: ${amountInXOF.toLocaleString('fr-FR')} XOF

💳 Méthode: ${order.payment_method || 'Non spécifiée'}`

    const results = await Promise.allSettled(
      ADMIN_PHONE_NUMBERS.map(async (phoneNumber, index) => {
        const formattedNumber = phoneNumber.startsWith('+')
          ? phoneNumber
          : `+${phoneNumber}`
        const toNumber = `whatsapp:${formattedNumber}`

        try {
          // Try to use template if configured
          if (TWILIO_WHATSAPP_TEMPLATE_ADMIN_NOTIFICATION) {
            const contentVariables = {
              '1': order.order_number,
              '2': order.customer_name || 'Non spécifié',
              '3': order.customer_phone || 'Non spécifié',
              '4': `${amountInXOF.toLocaleString('fr-FR')} XOF`,
              '5': order.payment_method || 'Non spécifiée',
            }

            try {
              const result = await client.messages.create({
                from: TWILIO_WHATSAPP_FROM,
                to: toNumber,
                contentSid: TWILIO_WHATSAPP_TEMPLATE_ADMIN_NOTIFICATION,
                contentVariables: JSON.stringify(contentVariables),
              })
              return { phoneNumber: formattedNumber, success: true, messageSid: result.sid, status: result.status, method: 'template' }
            } catch (templateError: any) {
              console.warn(`Template admin notification failed for ${formattedNumber}, falling back to freeform:`, templateError.message)
              // Fall through to freeform
            }
          }

          // Fallback to freeform message
          const result = await client.messages.create({
            from: TWILIO_WHATSAPP_FROM,
            to: toNumber,
            body: message,
          })

          return { phoneNumber: formattedNumber, success: true, messageSid: result.sid, status: result.status }
        } catch (error: any) {
          // Handle error 63016: Outside 24-hour window
          if (error?.code === 63016) {
            return {
              phoneNumber: formattedNumber,
              success: false,
              skipped: true,
              error: 'outside_24h_window',
              message: 'Cannot send freeform message outside 24-hour window. Use WhatsApp message template instead.',
              errorCode: error.code,
              errorDetails: error.message
            }
          }
          
          throw error
        }
      })
    )

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value
      } else {
        return {
          phoneNumber: ADMIN_PHONE_NUMBERS[index],
          success: false,
          error: result.reason?.message || result.reason,
          errorCode: result.reason?.code,
        }
      }
    })
  } catch (error: any) {
    throw error
  }
}

