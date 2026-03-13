import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Basic readiness check - just ensure the Next.js app is running
    // Don't block on database connectivity for initial readiness
    console.log('Readiness check: Application is running')
    
    // Return ready status immediately
    return NextResponse.json({ 
      status: 'ready',
      timestamp: new Date().toISOString(),
      message: 'Application is ready to serve requests'
    })
  } catch (error) {
    console.error('Readiness check failed:', error)
    return NextResponse.json(
      { 
        status: 'error',
        error: 'Application readiness check failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}