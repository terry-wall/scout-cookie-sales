'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Order } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import QRCodeDisplay from '@/components/QRCodeDisplay'
import Receipt from '@/components/Receipt'
import { ArrowLeft, ExternalLink } from 'lucide-react'

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchOrder(id as string)
    }
  }, [id])

  const fetchOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      } else if (response.status === 404) {
        setError('Order not found')
      } else {
        throw new Error('Failed to fetch order')
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      setError('Failed to load order')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-scout-green mx-auto"></div>
          <p className="mt-4">Loading order...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <p>{error || 'Order not found'}</p>
          <Link href="/scout/orders" className="mt-4 btn-primary inline-block">
            Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  const paymentUrl = `${window.location.origin}/payment/${order.id}`

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/scout/orders" className="flex items-center gap-2 text-scout-green hover:text-green-700">
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Order #{order.id.slice(-8).toUpperCase()}
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            
            <div className="space-y-3 text-gray-600">
              <div>
                <span className="font-medium">Customer:</span> {order.customerName}
              </div>
              <div>
                <span className="font-medium">Email:</span> {order.customerEmail}
              </div>
              {order.customerPhone && (
                <div>
                  <span className="font-medium">Phone:</span> {order.customerPhone}
                </div>
              )}
              <div>
                <span className="font-medium">Created:</span> {formatDate(order.createdAt)}
              </div>
              {order.completedAt && (
                <div>
                  <span className="font-medium">Completed:</span> {formatDate(order.completedAt)}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(item.unitPrice)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          {order.status === 'pending' && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Payment</h3>
              <p className="text-gray-600 mb-4">
                Share this QR code or link with the customer to complete payment:
              </p>
              <QRCodeDisplay url={paymentUrl} />
              <div className="mt-4">
                <Link 
                  href={paymentUrl}
                  target="_blank"
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Payment Page
                </Link>
              </div>
            </div>
          )}
          
          {order.status === 'completed' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Receipt</h3>
              <Receipt order={order} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}