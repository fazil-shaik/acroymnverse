import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('acronymverse')
    
    // Get trending acronyms (both trending:true and recent popular ones)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    let trendingAcronyms = await db.collection('acronyms')
      .find({
        $or: [
          { trending: true },
          { 
            createdAt: { $gte: sevenDaysAgo },
            votes: { $gte: 5 }
          }
        ]
      })
      .sort({ votes: -1, popularity: -1, createdAt: -1 })
      .limit(20)
      .toArray()

    // If no acronyms exist, create some sample trending data
    if (trendingAcronyms.length === 0) {
      const sampleAcronyms = [
        {
          acronym: 'FIRE',
          fullForm: 'Fueling Innovation, Reaching Everyone',
          industry: 'Technology',
          context: 'Used in tech startups when describing breakthrough innovations and scalable solutions.',
          popularity: 95,
          trending: true,
          tags: ['tech', 'innovation', 'startup'],
          emoji: '🚀',
          createdBy: 'system',
          createdAt: new Date(),
          votes: 245,
          votedBy: [],
          comments: []
        },
        {
          acronym: 'FLEX',
          fullForm: 'Future Leading Excellence Experience',
          industry: 'Social Media',
          context: 'Popular among Gen-Z for expressing confidence and showing off achievements.',
          popularity: 92,
          trending: true,
          tags: ['social', 'genz', 'confidence'],
          emoji: '💪',
          createdBy: 'system',
          createdAt: new Date(),
          votes: 189,
          votedBy: [],
          comments: []
        },
        {
          acronym: 'VIBE',
          fullForm: 'Very Inspiring Bold Energy',
          industry: 'Entertainment',
          context: 'Used to describe positive energy and good feelings in social situations.',
          popularity: 88,
          trending: true,
          tags: ['mood', 'positive', 'energy'],
          emoji: '✨',
          createdBy: 'system',
          createdAt: new Date(),
          votes: 156,
          votedBy: [],
          comments: []
        },
        {
          acronym: 'GOALS',
          fullForm: 'Great Opportunities Achieving Life Success',
          industry: 'Lifestyle',
          context: 'Used when something represents aspirational lifestyle or achievements.',
          popularity: 85,
          trending: true,
          tags: ['lifestyle', 'motivation', 'success'],
          emoji: '🎯',
          createdBy: 'system',
          createdAt: new Date(),
          votes: 134,
          votedBy: [],
          comments: []
        },
        {
          acronym: 'MOOD',
          fullForm: 'Magnificent Outlook, Outstanding Day',
          industry: 'Social Media',
          context: 'Used to express current emotional state or relate to content.',
          popularity: 82,
          trending: true,
          tags: ['emotion', 'relatable', 'social'],
          emoji: '😍',
          createdBy: 'system',
          createdAt: new Date(),
          votes: 112,
          votedBy: [],
          comments: []
        },
        {
          acronym: 'GLOW',
          fullForm: 'Generating Light, Overcoming Worries',
          industry: 'Lifestyle',
          context: 'Used to describe personal transformation and positive change.',
          popularity: 79,
          trending: true,
          tags: ['transformation', 'positive', 'lifestyle'],
          emoji: '🌟',
          createdBy: 'system',
          createdAt: new Date(),
          votes: 98,
          votedBy: [],
          comments: []
        }
      ]

      const insertResult = await db.collection('acronyms').insertMany(sampleAcronyms)
      trendingAcronyms = await db.collection('acronyms')
        .find({ _id: { $in: Object.values(insertResult.insertedIds) } })
        .toArray()
    }

    return NextResponse.json({ 
      acronyms: trendingAcronyms.map(acronym => ({
        ...acronym,
        id: acronym._id?.toString()
      }))
    })

  } catch (error) {
    console.error('Error fetching trending acronyms:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
