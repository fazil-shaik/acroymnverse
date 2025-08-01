import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import clientPromise from '../../../../lib/mongodb'
import { UserActivity, UserStats } from '../../../../types/database'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, acronym, acronymId, metadata } = await request.json()

    if (!action || !acronym) {
      return NextResponse.json({ error: 'Action and acronym are required' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('acronymverse')

    // Log the activity
    const activity = {
      userId,
      action,
      acronym,
      acronymId,
      timestamp: new Date(),
      metadata
    }

    await db.collection('userActivities').insertOne(activity)

    // Update user stats based on action
    const updateStats: Record<string, unknown> = {
      lastActivity: new Date()
    }

    switch (action) {
      case 'created':
        updateStats.$inc = { acronymsCreated: 1 }
        break
      case 'voted':
        updateStats.$inc = { totalVotes: 1 }
        break
      case 'searched':
        updateStats.$inc = { searchCount: 1 }
        break
    }

    await db.collection('userStats').updateOne(
      { userId },
      updateStats,
      { upsert: true }
    )

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error logging activity:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
