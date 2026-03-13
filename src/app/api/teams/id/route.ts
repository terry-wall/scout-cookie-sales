import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Team ID is required' },
        { status: 400 }
      )
    }

    // Mock team data for now since there's no database schema for teams
    const teamData = {
      id,
      name: `Team ${id}`,
      members: [],
      stats: {
        totalSales: 0,
        totalOrders: 0,
      }
    }
    
    return NextResponse.json(teamData)
  } catch (error) {
    console.error('Error fetching team:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}