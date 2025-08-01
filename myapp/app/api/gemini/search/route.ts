import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server'
import clientPromise from '../../../../lib/mongodb'
import { checkRateLimit } from '../../../../utils/rateLimit'

// You'll need to install @google/generative-ai and add your API key to .env.local
// npm install @google/generative-ai

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Rate limiting: Check if user has exceeded 2 searches per day
    if (userId) {
      const rateLimitResult = await checkRateLimit(userId, 2)
      
      if (!rateLimitResult.success) {
        return NextResponse.json({ 
          error: rateLimitResult.message,
          rateLimited: true,
          resetTime: rateLimitResult.resetTime.toISOString(),
          searchesRemaining: rateLimitResult.remaining
        }, { status: 429 });
      }

      try {
        const client = await clientPromise
        const db = client.db('acronymverse')

        // Log search activity
        await db.collection('userActivities').insertOne({
          userId,
          action: 'searched',
          acronym: query,
          timestamp: new Date(),
          metadata: { searchQuery: query }
        })

        // Update search count in user stats
        await db.collection('userStats').updateOne(
          { userId },
          { 
            $inc: { searchCount: 1 },
            $set: { lastActivity: new Date() }
          },
          { upsert: true }
        )
        
      } catch (dbError) {
        console.error('Error logging search activity:', dbError)
        // Continue with search even if logging fails
      }
    }

    // Enhanced acronym generation logic
    const generateAcronyms = (query: string) => {
      const word = query.toLowerCase()
      const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1)
      
      // Different industry-specific generations
      const industries = [
        {
          name: 'Technology',
          templates: [
            `${capitalizedWord} Intelligence Revolutionizing Everything`,
            `Future Innovation Reaching Excellence`,
            `Fast Integration, Real Excellence`,
            `Fueling Innovation, Reaching Everyone`,
            `Forward-thinking Innovation Revolutionary Engine`
          ],
          emoji: '🚀',
          tags: ['tech', 'innovation', 'future']
        },
        {
          name: 'Social Media',
          templates: [
            `Flex It, Run Everything`,
            `Fresh Ideas, Real Energy`,
            `${capitalizedWord} Influence, Real Engagement`,
            `Fun Interactive Real Experience`,
            `Fierce Independent Rebel Energy`
          ],
          emoji: '🔥',
          tags: ['social', 'genz', 'viral']
        },
        {
          name: 'Entertainment',
          templates: [
            `Fun Interactive Real Entertainment`,
            `${capitalizedWord} Inspiring Real Excitement`,
            `Fresh Ideas, Raw Entertainment`,
            `Fantastic Interactive Reality Experience`,
            `Fierce Independent Revolutionary Entertainment`
          ],
          emoji: '🎭',
          tags: ['entertainment', 'fun', 'creative']
        }
      ]

      return industries.map((industry, index) => {
        const template = industry.templates[Math.floor(Math.random() * industry.templates.length)]
        const popularity = Math.floor(Math.random() * 30) + 70 + (index * 5) // Slight variation
        
        return {
          acronym: query.toUpperCase(),
          fullForm: template,
          industry: industry.name,
          context: `${industry.name === 'Social Media' ? 'Perfect for' : 'Commonly used in'} ${industry.name.toLowerCase()} when describing ${word}-related content and innovations.`,
          popularity,
          trending: Math.random() > 0.3,
          tags: industry.tags,
          emoji: industry.emoji
        }
      })
    }

    const mockResults = generateAcronyms(query);

    // Include rate limit info in response for authenticated users
    const responseData: { results: typeof mockResults; rateLimitInfo?: unknown } = { results: mockResults }
    
    if (userId) {
      try {
        const client = await clientPromise
        const db = client.db('acronymverse')
        
        // Get current day's rate limit info
        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
        
        const rateLimitRecord = await db.collection('rateLimits').findOne({
          userId,
          date: { $gte: startOfDay, $lt: endOfDay }
        })
        
        const usedRequests = rateLimitRecord ? rateLimitRecord.count : 0
        
        responseData.rateLimitInfo = {
          searchesRemaining: Math.max(0, 2 - usedRequests),
          resetTime: endOfDay.toISOString()
        }
      } catch (error) {
        console.error('Error getting rate limit info:', error)
      }
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in Gemini search:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
