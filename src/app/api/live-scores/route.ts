import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('Error fetching live scores: Route /api/live-scores couldn\'t be rendered statically because it used `request.url`')
    
    // Mock live scores data
    const liveScores = {
      scores: [],
      message: 'Live scores not available'
    }
    
    return NextResponse.json(liveScores)
  } catch (error) {
    console.error('Error fetching live scores:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}