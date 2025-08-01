import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import clientPromise from '../../../lib/mongodb'
import { UserStats, UserActivity } from '../../../types/database'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db('acronymverse')
    
    // Get or create user stats
    let userStats = await db.collection('userStats').findOne({ userId })
    
    if (!userStats) {
      // Create initial user stats
      const initialStats = {
        userId,
        acronymsCreated: 0,
        totalVotes: 0,
        totalVotesReceived: 0,
        followers: 0,
        following: 0,
        searchCount: 0,
        lastActivity: new Date(),
        joinedAt: new Date(),
        achievements: []
      }
      
      const result = await db.collection('userStats').insertOne(initialStats)
      userStats = { ...initialStats, _id: result.insertedId }
    }

    // Get recent activities (last 10)
    const recentActivities = await db.collection('userActivities')
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray()

    // Get trending acronyms from the last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const trendingAcronyms = await db.collection('acronyms')
      .find({
        $or: [
          { trending: true },
          { createdAt: { $gte: sevenDaysAgo } }
        ]
      })
      .sort({ votes: -1, createdAt: -1 })
      .limit(6)
      .toArray()

    // Update last activity
    await db.collection('userStats').updateOne(
      { userId },
      { $set: { lastActivity: new Date() } }
    )

    return NextResponse.json({
      userStats,
      recentActivities: recentActivities.map(activity => ({
        ...activity,
        id: activity._id?.toString()
      })),
      trendingAcronyms: trendingAcronyms.map(acronym => ({
        ...acronym,
        id: acronym._id?.toString()
      }))
    })

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
