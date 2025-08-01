import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { checkRateLimit } from '../../../utils/rateLimit'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Test rate limiting with 2 requests per day
    const rateLimitResult = await checkRateLimit(userId, 2)
    
    if (!rateLimitResult.success) {
      return NextResponse.json({ 
        error: rateLimitResult.message,
        limit: rateLimitResult.limit,
        remaining: rateLimitResult.remaining,
        resetTime: rateLimitResult.resetTime
      }, { status: 429 })
    }

    return NextResponse.json({ 
      message: 'Test API call successful',
      rateLimitInfo: {
        remaining: rateLimitResult.remaining,
        resetTime: rateLimitResult.resetTime,
        limit: rateLimitResult.limit
      }
    })

  } catch (error) {
    console.error('Error in test endpoint:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
