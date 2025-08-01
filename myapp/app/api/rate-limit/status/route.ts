import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getRateLimitStatus } from '../../../../utils/rateLimit'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rateLimitStatus = await getRateLimitStatus(userId, 2)

    return NextResponse.json({
      limit: rateLimitStatus.limit,
      remaining: rateLimitStatus.remaining,
      resetTime: rateLimitStatus.resetTime,
      canMakeRequest: rateLimitStatus.success,
      message: rateLimitStatus.message
    })

  } catch (error) {
    console.error('Error checking rate limit status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
