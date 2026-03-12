import Link from 'next/link'
import { ShoppingCart, User, Package } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Scout Cookie Sales
        </h2>
        <p className="text-lg text-gray-600">
          Manage your scout cookie orders and sales with ease
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Link href="/scout" className="block">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center w-16 h-16 bg-scout-green rounded-full mx-auto mb-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Scout Portal</h3>
            <p className="text-gray-600 text-center">
              Create new orders and manage your cookie sales
            </p>
          </div>
        </Link>

        <Link href="/scout/orders" className="block">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center w-16 h-16 bg-scout-gold rounded-full mx-auto mb-4">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">View Orders</h3>
            <p className="text-gray-600 text-center">
              Track and manage all your cookie orders
            </p>
          </div>
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4">
            <Package className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">Quick Stats</h3>
          <p className="text-gray-600 text-center">
            View your sales performance and achievements
          </p>
        </div>
      </div>
    </div>
  )
}