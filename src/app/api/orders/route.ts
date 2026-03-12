import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { getDatabase } from '@/lib/database'

export async function GET() {
  try {
    const db = await getDatabase()
    const result = await db.query(`
      SELECT 
        o.*,
        json_agg(
          json_build_object(
            'productId', oi.product_id,
            'productName', oi.product_name,
            'unitPrice', oi.unit_price,
            'quantity', oi.quantity
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `)
    
    const orders = result.rows.map(row => ({
      id: row.id,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      customerPhone: row.customer_phone,
      status: row.status,
      totalAmount: parseFloat(row.total_amount),
      createdAt: row.created_at,
      completedAt: row.completed_at,
      items: row.items || []
    }))
    
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerName, customerEmail, customerPhone, items, totalAmount } = body
    
    if (!customerName || !customerEmail || !items || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const db = await getDatabase()
    const orderId = uuidv4()
    
    // Start transaction
    await db.query('BEGIN')
    
    try {
      // Insert order
      await db.query(`
        INSERT INTO orders (
          id, customer_name, customer_email, customer_phone, 
          status, total_amount, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
      `, [orderId, customerName, customerEmail, customerPhone, 'pending', totalAmount])
      
      // Insert order items
      for (const item of items) {
        await db.query(`
          INSERT INTO order_items (
            order_id, product_id, product_name, unit_price, quantity
          ) VALUES ($1, $2, $3, $4, $5)
        `, [orderId, item.productId, item.productName, item.unitPrice, item.quantity])
      }
      
      await db.query('COMMIT')
      
      return NextResponse.json({ orderId })
    } catch (error) {
      await db.query('ROLLBACK')
      throw error
    }
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}