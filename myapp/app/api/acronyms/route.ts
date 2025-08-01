import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { ObjectId } from 'mongodb'
import clientPromise from '../../../lib/mongodb'
import { checkRateLimit } from '../../../utils/rateLimit'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db('acronymverse')

    // Get user's created acronyms
    const acronyms = await db.collection('acronyms')
      .find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({ acronyms })

  } catch (error) {
    console.error('Error fetching user acronyms:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check rate limit - 2 requests per day
    const rateLimitResult = await checkRateLimit(userId, 2)
    
    if (!rateLimitResult.success) {
      return NextResponse.json({ 
        error: rateLimitResult.message,
        limit: rateLimitResult.limit,
        remaining: rateLimitResult.remaining,
        resetTime: rateLimitResult.resetTime
      }, { status: 429 })
    }

    const { acronym, fullForm, industry, context, tags } = await request.json()

    if (!acronym || !fullForm) {
      return NextResponse.json({ error: 'Acronym and full form are required' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('acronymverse')

    // Create new acronym
    const newAcronym = {
      acronym: acronym.toUpperCase(),
      fullForm,
      industry: industry || 'General',
      context: context || '',
      tags: tags || [],
      createdBy: userId,
      createdAt: new Date(),
      votes: 0,
      popularity: 0,
      trending: false
    }

    const result = await db.collection('acronyms').insertOne(newAcronym)

    // Log the creation activity
    await db.collection('userActivities').insertOne({
      userId,
      action: 'created',
      acronym: acronym.toUpperCase(),
      timestamp: new Date(),
      metadata: { acronymId: result.insertedId }
    })

    // Update user stats
    await db.collection('userStats').updateOne(
      { userId },
      { 
        $inc: { acronymsCreated: 1 },
        $set: { lastActivity: new Date() }
      },
      { upsert: true }
    )

    return NextResponse.json({ 
      success: true, 
      acronym: { ...newAcronym, _id: result.insertedId },
      rateLimitInfo: {
        remaining: rateLimitResult.remaining,
        resetTime: rateLimitResult.resetTime
      }
    })

  } catch (error) {
    console.error('Error creating acronym:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const acronymId = searchParams.get('id')

    if (!acronymId) {
      return NextResponse.json({ error: 'Acronym ID is required' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('acronymverse')

    // Verify the acronym belongs to the user
    const acronym = await db.collection('acronyms').findOne({
      _id: new ObjectId(acronymId),
      createdBy: userId
    })

    if (!acronym) {
      return NextResponse.json({ error: 'Acronym not found or unauthorized' }, { status: 404 })
    }

    // Delete the acronym
    await db.collection('acronyms').deleteOne({
      _id: new ObjectId(acronymId)
    })

    // Log the deletion activity
    await db.collection('userActivities').insertOne({
      userId,
      action: 'deleted',
      acronym: acronym.acronym,
      timestamp: new Date(),
      metadata: { deletedAcronymId: acronymId }
    })

    // Update user stats
    await db.collection('userStats').updateOne(
      { userId },
      { 
        $inc: { acronymsCreated: -1 },
        $set: { lastActivity: new Date() }
      }
    )

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting acronym:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
