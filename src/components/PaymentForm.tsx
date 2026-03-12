'use client'

import { useState } from 'react'
import { Order } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { CreditCard, Lock } from 'lucide-react'

interface PaymentFormProps {
  order: Order
  onPaymentSuccess: () => void
}

export default function PaymentForm({ order, onPaymentSuccess }: PaymentFormProps) {
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    try {
      // Create payment intent
      const paymentResponse = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
          amount: order.totalAmount
        })
      })

      if (!paymentResponse.ok) {
        throw new Error('Failed to create payment intent')
      }

      const { clientSecret, paymentIntentId } = await paymentResponse.json()
      
      // Simulate payment processing (in real app, use Stripe Elements)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Complete the order
      const completeResponse = await fetch(`/api/orders/${order.id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId
        })
      })

      if (completeResponse.ok) {
        onPaymentSuccess()
      } else {
        throw new Error('Failed to complete order')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '')
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    return v
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Lock className="h-4 w-4" />
        <span>Secure payment powered by Stripe</span>
      </div>
      
      <div>
        <label className="form-label">Payment Method</label>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-scout-green"
            />
            <CreditCard className="h-4 w-4" />
            <span>Credit/Debit Card</span>
          </label>
        </div>
      </div>

      {paymentMethod === 'card' && (
        <div className="space-y-4">
          <div>
            <label className="form-label">Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardDetails.number}
              onChange={(e) => setCardDetails(prev => ({ 
                ...prev, 
                number: formatCardNumber(e.target.value) 
              }))}
              className="form-input"
              maxLength={19}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={cardDetails.expiry}
                onChange={(e) => setCardDetails(prev => ({ 
                  ...prev, 
                  expiry: formatExpiry(e.target.value) 
                }))}
                className="form-input"
                maxLength={5}
                required
              />
            </div>
            <div>
              <label className="form-label">CVC</label>
              <input
                type="text"
                placeholder="123"
                value={cardDetails.cvc}
                onChange={(e) => setCardDetails(prev => ({ 
                  ...prev, 
                  cvc: e.target.value.replace(/\D/g, '') 
                }))}
                className="form-input"
                maxLength={4}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="form-label">Cardholder Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={cardDetails.name}
              onChange={(e) => setCardDetails(prev => ({ 
                ...prev, 
                name: e.target.value 
              }))}
              className="form-input"
              required
            />
          </div>
        </div>
      )}
      
      <div className="border-t pt-4">
        <div className="flex justify-between items-center text-lg font-semibold mb-4">
          <span>Total to pay:</span>
          <span>{formatCurrency(order.totalAmount)}</span>
        </div>
        
        <button
          type="submit"
          disabled={processing}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing Payment...
            </div>
          ) : (
            `Pay ${formatCurrency(order.totalAmount)}`
          )}
        </button>
      </div>
    </form>
  )
}