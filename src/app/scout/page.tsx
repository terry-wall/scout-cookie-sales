'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ProductList from '@/components/ProductList'
import OrderSummary from '@/components/OrderSummary'
import { Product, OrderItem } from '@/lib/types'

const COOKIE_PRODUCTS: Product[] = [
  { id: '1', name: 'Thin Mints', price: 5.00, description: 'Crispy chocolate wafers dipped in chocolate coating' },
  { id: '2', name: 'Samoas/Caramel deLites', price: 5.00, description: 'Caramel and chocolate coating with coconut and chocolate drizzle' },
  { id: '3', name: 'Tagalongs/Peanut Butter Patties', price: 5.00, description: 'Crispy vanilla cookies layered with peanut butter and chocolate' },
  { id: '4', name: 'Do-si-dos/Peanut Butter Sandwich', price: 5.00, description: 'Peanut butter sandwich cookies' },
  { id: '5', name: 'Trefoils/Shortbread', price: 5.00, description: 'Classic shortbread cookies' },
  { id: '6', name: 'Lemon-Ups', price: 5.00, description: 'Crispy lemon cookies with inspiring messages' },
]

export default function ScoutPage() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const addToOrder = (product: Product, quantity: number) => {
    setOrderItems(prev => {
      const existing = prev.find(item => item.productId === product.id)
      if (existing) {
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, {
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity
      }]
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setOrderItems(prev => prev.filter(item => item.productId !== productId))
    } else {
      setOrderItems(prev =>
        prev.map(item =>
          item.productId === productId
            ? { ...item, quantity }
            : item
        )
      )
    }
  }

  const getTotalAmount = () => {
    return orderItems.reduce((total, item) => total + (item.unitPrice * item.quantity), 0)
  }

  const handleSubmitOrder = async () => {
    if (orderItems.length === 0 || !customerInfo.name || !customerInfo.email) {
      alert('Please add items to your order and fill in customer information')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          items: orderItems,
          totalAmount: getTotalAmount()
        })
      })

      if (response.ok) {
        const { orderId } = await response.json()
        router.push(`/scout/orders/${orderId}`)
      } else {
        throw new Error('Failed to create order')
      }
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Failed to create order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Create New Order</h2>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Select Products</h3>
          <ProductList products={COOKIE_PRODUCTS} onAddToOrder={addToOrder} />
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Customer Information</h3>
            <div className="space-y-4">
              <div>
                <label className="form-label">Customer Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className="form-input"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
          </div>
          
          <OrderSummary 
            items={orderItems} 
            onUpdateQuantity={updateQuantity}
            onSubmit={handleSubmitOrder}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  )
}