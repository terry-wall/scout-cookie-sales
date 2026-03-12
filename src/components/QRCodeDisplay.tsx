'use client'

import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { Copy, Check } from 'lucide-react'

interface QRCodeDisplayProps {
  url: string
}

export default function QRCodeDisplay({ url }: QRCodeDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    QRCode.toDataURL(url, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    .then(setQrCodeUrl)
    .catch(console.error)
  }, [url])

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }

  return (
    <div className="text-center">
      {qrCodeUrl && (
        <div className="mb-4">
          <img 
            src={qrCodeUrl} 
            alt="Payment QR Code" 
            className="mx-auto border border-gray-300 rounded-md"
          />
        </div>
      )}
      
      <div className="bg-gray-50 rounded-md p-3 mb-3">
        <p className="text-sm text-gray-600 mb-2">Payment URL:</p>
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            value={url} 
            readOnly 
            className="flex-1 text-xs bg-white border border-gray-300 rounded px-2 py-1 font-mono"
          />
          <button
            type="button"
            onClick={handleCopyUrl}
            className="btn-secondary p-2 min-w-[2rem] h-8 flex items-center justify-center"
            title="Copy URL"
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        </div>
      </div>
      
      <p className="text-sm text-gray-600">
        Customer can scan this QR code or visit the URL to complete payment.
      </p>
    </div>
  )
}