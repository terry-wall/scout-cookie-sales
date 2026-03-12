import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/database'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { paymentIntentId } = body
    
    const db = await getDatabase()
    
    // Update order status to completed
    await db.query(`
      UPDATE orders 
      SET 
        status = 'completed',
        completed_at = NOW(),
        payment_intent_id = $1
      WHERE id = $2
    `, [paymentIntentId || null, id])
    
    // Fetch updated order
    const orderResult = await db.query(`
      SELECT * FROM orders WHERE id = $1
    `, [id])
    
    if (orderResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }
    
    const itemsResult = await db.query(`
      SELECT * FROM order_items WHERE order_id = $1
    `, [id])
    
    const order = orderResult.rows[0]
    const items = itemsResult.rows.map(row => ({
      productId: row.product_id,
      productName: row.product_name,
      unitPrice: parseFloat(row.unit_price),
      quantity: row.quantity
    }))
    
    const orderData = {
      id: order.id,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      status: order.status,
      totalAmount: parseFloat(order.total_amount),
      createdAt: order.created_at,
      completedAt: order.completed_at,
      items
    }
    
    return NextResponse.json(orderData)
  } catch (error) {
    console.error('Error completing order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}