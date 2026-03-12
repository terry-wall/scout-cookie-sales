'use client'

import { Order } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Download, Mail } from 'lucide-react'

interface ReceiptProps {
  order: Order
}

export default function Receipt({ order }: ReceiptProps) {
  const handlePrint = () => {
    window.print()
  }

  const handleEmailReceipt = async () => {
    // In a real app, this would send an email
    alert('Receipt email functionality would be implemented here')
  }

  return (
    <div className="bg-white">
      <div className="print:hidden flex gap-2 mb-4">
        <button
          onClick={handlePrint}
          className="btn-secondary flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          Print
        </button>
        <button
          onClick={handleEmailReceipt}
          className="btn-secondary flex items-center gap-1"
        >
          <Mail className="h-4 w-4" />
          Email
        </button>
      </div>
      
      <div className="border border-gray-300 rounded-lg p-6 print:border-0 print:shadow-none">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Scout Cookie Sales</h2>
          <p className="text-gray-600">Payment Receipt</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <p className="font-medium text-gray-900">Order #</p>
            <p className="text-gray-600">{order.id.slice(-8).toUpperCase()}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Date</p>
            <p className="text-gray-600">{formatDate(order.completedAt || order.createdAt)}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Customer</p>
            <p className="text-gray-600">{order.customerName}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Email</p>
            <p className="text-gray-600">{order.customerEmail}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Items Purchased</h3>
          <div className="space-y-2">
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
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total Paid:</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t text-center text-sm text-gray-600">
          <p>Thank you for supporting our scouts!</p>
          <p className="mt-1">Questions? Contact us at support@scoutcookies.com</p>
        </div>
      </div>
    </div>
  )
}