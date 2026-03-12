export interface Product {
  id: string
  name: string
  price: number
  description: string
}

export interface OrderItem {
  productId: string
  productName: string
  unitPrice: number
  quantity: number
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  status: 'pending' | 'completed' | 'cancelled'
  totalAmount: number
  items: OrderItem[]
  createdAt: string
  completedAt?: string
  paymentIntentId?: string
}

export interface CustomerInfo {
  name: string
  email: string
  phone?: string
}