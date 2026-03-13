import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/database'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }
    
    const db = await getDatabase()
    
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
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }
    
    const body = await request.json()
    const { status } = body
    
    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }
    
    const db = await getDatabase()
    const completedAt = status === 'completed' ? 'NOW()' : 'NULL'
    
    await db.query(`
      UPDATE orders 
      SET status = $1, completed_at = ${completedAt}
      WHERE id = $2
    `, [status, id])
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}