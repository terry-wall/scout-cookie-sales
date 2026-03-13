import { NextResponse } from 'next/server'
import { ensureDatabaseReady } from '@/lib/database'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('Starting application initialization...')
    
    const isReady = await ensureDatabaseReady()
    
    if (!isReady) {
      console.log('Application initialization failed: Database not ready')
      return NextResponse.json(
        { error: 'Database not ready' },
        { status: 503 }
      )
    }

    console.log('Application initialization successful')
    return NextResponse.json({ status: 'ready' })
  } catch (error) {
    console.error('Application initialization failed:', error)
    console.error('Readiness check failed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}