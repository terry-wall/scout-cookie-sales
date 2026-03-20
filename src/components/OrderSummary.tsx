'use client'

import { OrderItem } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { Trash2 } from 'lucide-react'

interface OrderSummaryProps {
  items: OrderItem[]
  onUpdateQuantity: (productId: string, quantity: number) => void
  onSubmit: () => void
  isSubmitting: boolean
}

export default function OrderSummary({ items, onUpdateQuantity, onSubmit, isSubmitting }: OrderSummaryProps) {
  const getTotalAmount = () => {
    return items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0)
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Order Summary</h3>
        <p className="text-gray-600">No items in order yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">Order Summary</h3>
      
      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center justify-between py-2 border-b border-gray-200">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.productName}</p>
              <p className="text-sm text-gray-600">{formatCurrency(item.unitPrice)} each</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                  className="px-2 py-1 text-gray-600 hover:text-gray-800"
                  disabled={item.quantity <= 1}
                >
                  −
                </button>
                <span className="px-3 py-1 text-center min-w-[2rem] text-gray-900">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                  className="px-2 py-1 text-gray-600 hover:text-gray-800"
                >
                  +
                </button>
              </div>
              
              <span className="font-semibold min-w-[4rem] text-right text-gray-900">
                {formatCurrency(item.unitPrice * item.quantity)}
              </span>
              
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.productId, 0)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-4">
        <div className="flex justify-between items-center text-xl font-bold mb-4">
          <span className="text-gray-900">Total:</span>
          <span className="text-gray-900">{formatCurrency(getTotalAmount())}</span>
        </div>
        
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || items.length === 0}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating Order...' : 'Create Order'}
        </button>
      </div>
    </div>
  )
}