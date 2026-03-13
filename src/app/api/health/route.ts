import { NextResponse } from 'next/server'
import { ensureDatabaseReady } from '@/lib/database'

export const dynamic = 'force-dynamic'

export async function GET() {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    checks: {
      app: 'ok',
      database: 'unknown'
    }
  }

  try {
    // Check database connectivity (non-blocking)
    try {
      const dbReady = await Promise.race([
        ensureDatabaseReady(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database check timeout')), 5000)
        )
      ])
      
      healthCheck.checks.database = dbReady ? 'ok' : 'error'
    } catch (dbError) {
      console.warn('Database health check failed:', dbError)
      healthCheck.checks.database = 'error'
    }

    // Determine overall status
    const hasErrors = Object.values(healthCheck.checks).some(status => status === 'error')
    healthCheck.status = hasErrors ? 'degraded' : 'ok'

    return NextResponse.json(healthCheck)
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json(
      { 
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        checks: {
          app: 'error',
          database: 'unknown'
        }
      },
      { status: 500 }
    )
  }
}