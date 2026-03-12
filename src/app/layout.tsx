import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Scout Cookie Sales',
  description: 'A mobile-friendly app for scouts to create orders and manage cookie sales',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-scout-green text-white p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">Scout Cookie Sales</h1>
          </div>
        </header>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  )
}