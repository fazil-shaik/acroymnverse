import clientPromise from '../lib/mongodb'

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetTime: Date
  message?: string
}

export async function checkRateLimit(userId: string, limit: number = 2): Promise<RateLimitResult> {
  try {
    const client = await clientPromise
    const db = client.db('acronymverse')
    const rateLimitCollection = db.collection('rateLimits')

    // Get current date and start of day
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)

    // Find existing rate limit record for today
    const rateLimitRecord = await rateLimitCollection.findOne({
      userId,
      date: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    })

    if (!rateLimitRecord) {
      // Create new rate limit record for today
      await rateLimitCollection.insertOne({
        userId,
        count: 1,
        date: startOfDay,
        createdAt: now
      })

      return {
        success: true,
        limit,
        remaining: limit - 1,
        resetTime: endOfDay
      }
    }

    // Check if limit exceeded
    if (rateLimitRecord.count >= limit) {
      return {
        success: false,
        limit,
        remaining: 0,
        resetTime: endOfDay,
        message: `Rate limit exceeded. You can make ${limit} requests per day. Please try again tomorrow.`
      }
    }

    // Increment the count
    await rateLimitCollection.updateOne(
      { _id: rateLimitRecord._id },
      { $inc: { count: 1 } }
    )

    return {
      success: true,
      limit,
      remaining: limit - (rateLimitRecord.count + 1),
      resetTime: endOfDay
    }

  } catch (error) {
    console.error('Rate limit check error:', error)
    // On error, allow the request but log it
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  }
}

export async function getRateLimitStatus(userId: string, limit: number = 2): Promise<RateLimitResult> {
  try {
    const client = await clientPromise
    const db = client.db('acronymverse')
    const rateLimitCollection = db.collection('rateLimits')

    // Get current date and start of day
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)

    // Find existing rate limit record for today
    const rateLimitRecord = await rateLimitCollection.findOne({
      userId,
      date: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    })

    if (!rateLimitRecord) {
      return {
        success: true,
        limit,
        remaining: limit,
        resetTime: endOfDay
      }
    }

    return {
      success: rateLimitRecord.count < limit,
      limit,
      remaining: Math.max(0, limit - rateLimitRecord.count),
      resetTime: endOfDay,
      message: rateLimitRecord.count >= limit ? 
        `Rate limit exceeded. You can make ${limit} requests per day. Please try again tomorrow.` : 
        undefined
    }

  } catch (error) {
    console.error('Rate limit status error:', error)
    return {
      success: true,
      limit,
      remaining: limit,
      resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  }
}
