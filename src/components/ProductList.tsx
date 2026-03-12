'use client'

import { useState } from 'react'
import { Product } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { Plus } from 'lucide-react'

interface ProductListProps {
  products: Product[]
  onAddToOrder: (product: Product, quantity: number) => void
}

export default function ProductList({ products, onAddToOrder }: ProductListProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const handleQuantityChange = (productId: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, quantity)
    }))
  }

  const handleAddToOrder = (product: Product) => {
    const quantity = quantities[product.id] || 1
    onAddToOrder(product, quantity)
    // Reset quantity to 1 after adding
    setQuantities(prev => ({
      ...prev,
      [product.id]: 1
    }))
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-3 sm:mb-0">
              <h4 className="text-lg font-semibold text-gray-900">{product.name}</h4>
              <p className="text-gray-600 text-sm mb-1">{product.description}</p>
              <p className="text-scout-green font-semibold">{formatCurrency(product.price)}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 1) - 1)}
                  className="px-2 py-1 text-gray-600 hover:text-gray-800"
                  disabled={(quantities[product.id] || 1) <= 1}
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantities[product.id] || 1}
                  onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 1)}
                  className="w-16 text-center py-1 border-0 focus:ring-0"
                />
                <button
                  type="button"
                  onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 1) + 1)}
                  className="px-2 py-1 text-gray-600 hover:text-gray-800"
                >
                  +
                </button>
              </div>
              
              <button
                type="button"
                onClick={() => handleAddToOrder(product)}
                className="btn-primary flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}