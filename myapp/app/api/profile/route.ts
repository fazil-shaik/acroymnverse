import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import clientPromise from '../../../lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db('acronymverse')

    // Get user stats
    const userStats = await db.collection('userStats').findOne({ userId }) || {
      userId,
      acronymsCreated: 0,
      votesReceived: 0,
      votesGiven: 0,
      searchCount: 0,
      followers: 0,
      following: 0,
      lastActivity: new Date()
    }

    // Get user achievements
    const achievements = await db.collection('userAchievements').find({ userId }).toArray()
    
    // Default achievements if none exist
    const defaultAchievements = [
      { 
        id: 'first_acronym', 
        title: 'First Acronym', 
        description: 'Created your first acronym', 
        icon: '🎯', 
        unlocked: userStats.acronymsCreated > 0,
        progress: Math.min(100, userStats.acronymsCreated * 100),
        date: userStats.acronymsCreated > 0 ? userStats.lastActivity : null
      },
      { 
        id: 'vote_master', 
        title: 'Vote Master', 
        description: 'Cast 50 votes on acronyms', 
        icon: '🗳️', 
        unlocked: userStats.votesGiven >= 50,
        progress: Math.min(100, (userStats.votesGiven / 50) * 100),
        date: userStats.votesGiven >= 50 ? userStats.lastActivity : null
      },
      { 
        id: 'popular_creator', 
        title: 'Popular Creator', 
        description: 'Got 100 votes on your acronyms', 
        icon: '⭐', 
        unlocked: userStats.votesReceived >= 100,
        progress: Math.min(100, (userStats.votesReceived / 100) * 100),
        date: userStats.votesReceived >= 100 ? userStats.lastActivity : null
      },
      { 
        id: 'community_builder', 
        title: 'Community Builder', 
        description: 'Got 10 followers', 
        icon: '👥', 
        unlocked: userStats.followers >= 10,
        progress: Math.min(100, (userStats.followers / 10) * 100),
        date: userStats.followers >= 10 ? userStats.lastActivity : null
      },
      { 
        id: 'search_explorer', 
        title: 'Search Explorer', 
        description: 'Made 25 searches', 
        icon: '🔍', 
        unlocked: userStats.searchCount >= 25,
        progress: Math.min(100, (userStats.searchCount / 25) * 100),
        date: userStats.searchCount >= 25 ? userStats.lastActivity : null
      }
    ]

    const userAchievements = achievements.length > 0 ? achievements : defaultAchievements

    // Get user's created acronyms
    const userAcronyms = await db.collection('acronyms').find({ createdBy: userId }).sort({ createdAt: -1 }).limit(10).toArray()

    // Get recent activities
    const recentActivities = await db.collection('userActivities')
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray()

    // Format activities for display
    const formattedActivities = recentActivities.map(activity => ({
      id: activity._id,
      action: activity.action,
      acronym: activity.acronym,
      timestamp: activity.timestamp,
      description: getActivityDescription(activity)
    }))

    return NextResponse.json({
      stats: userStats,
      achievements: userAchievements,
      acronyms: userAcronyms,
      recentActivities: formattedActivities
    })

  } catch (error) {
    console.error('Error fetching profile data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getActivityDescription(activity: Record<string, unknown>) {
  const action = activity.action as string
  const acronym = activity.acronym as string
  const metadata = activity.metadata as Record<string, unknown> | undefined

  switch (action) {
    case 'created':
      return `Created "${acronym}" acronym`
    case 'voted':
      return `Voted on "${acronym}"`
    case 'searched':
      return `Searched for "${acronym}"`
    case 'commented':
      return `Commented on "${acronym}"`
    case 'followed':
      return `Started following a user`
    case 'achievement':
      return `Unlocked "${metadata?.achievementTitle || 'an'}" achievement`
    default:
      return `Performed ${action} action`
  }
}
