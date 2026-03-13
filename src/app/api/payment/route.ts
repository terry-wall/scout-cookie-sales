import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getDatabase } from '@/lib/database'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, amount } = body
    
    if (!orderId || !amount) {
      return NextResponse.json(
        { error: 'Missing orderId or amount' },
        { status: 400 }
      )
    }
    
    // Verify order exists and is pending
    const db = await getDatabase()
    const orderResult = await db.query(
      'SELECT * FROM orders WHERE id = $1 AND status = $2',
      [orderId, 'pending']
    )
    
    if (orderResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Order not found or already processed' },
        { status: 404 }
      )
    }
    
    const order = orderResult.rows[0]
    
    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: orderId,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
      },
      receipt_email: order.customer_email,
      description: `Scout Cookie Order #${orderId.slice(-8).toUpperCase()}`,
    })
    
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}