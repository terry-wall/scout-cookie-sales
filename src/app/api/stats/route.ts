import { NextResponse } from 'next/server'
import { query } from '@/lib/database'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Mock stats data since we don't have stats tables
    const stats = {
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0
    }
    
    try {
      const orderStats = await query(`
        SELECT 
          COUNT(*) as total_orders,
          COALESCE(SUM(total_amount), 0) as total_revenue,
          COALESCE(AVG(total_amount), 0) as average_order_value
        FROM orders
        WHERE status = 'completed'
      `)
      
      if (orderStats.rows.length > 0) {
        const row = orderStats.rows[0]
        stats.totalOrders = parseInt(row.total_orders)
        stats.totalRevenue = parseFloat(row.total_revenue)
        stats.averageOrderValue = parseFloat(row.average_order_value)
      }
    } catch (dbError) {
      console.error('Database error in stats:', dbError)
    }
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}