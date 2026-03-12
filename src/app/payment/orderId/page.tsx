'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Order } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import PaymentForm from '@/components/PaymentForm'
import Receipt from '@/components/Receipt'
import { CheckCircle } from 'lucide-react'

export default function PaymentPage() {
  const { orderId } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paymentCompleted, setPaymentCompleted] = useState(false)

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId as string)
    }
  }, [orderId])

  const fetchOrder = async (id: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
        if (data.status === 'completed') {
          setPaymentCompleted(true)
        }
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

  const handlePaymentSuccess = () => {
    setPaymentCompleted(true)
    // Refetch order to get updated status
    if (orderId) {
      fetchOrder(orderId as string)
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
        </div>
      </div>
    )
  }

  if (paymentCompleted || order.status === 'completed') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600">Thank you for your purchase. Your order has been completed.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <Receipt order={order} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Order</h2>
          <p className="text-gray-600">Order for {order.customerName}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
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
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
          <PaymentForm 
            order={order} 
            onPaymentSuccess={handlePaymentSuccess}
          />
        </div>
      </div>
    </div>
  )
}