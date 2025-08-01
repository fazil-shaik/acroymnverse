'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'

interface RateLimitInfo {
  limit: number
  remaining: number
  resetTime: string
  canMakeRequest: boolean
  message?: string
}

export default function RateLimitStatus() {
  const { isSignedIn } = useAuth()
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchRateLimitStatus = async () => {
    if (!isSignedIn) return

    setLoading(true)
    try {
      const response = await fetch('/api/rate-limit/status')
      if (response.ok) {
        const data = await response.json()
        setRateLimitInfo(data)
      }
    } catch (error) {
      console.error('Error fetching rate limit status:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRateLimitStatus()
  }, [isSignedIn])

  if (!isSignedIn || !rateLimitInfo) return null

  const resetDate = new Date(rateLimitInfo.resetTime)
  const timeUntilReset = resetDate.getTime() - Date.now()
  const hoursUntilReset = Math.ceil(timeUntilReset / (1000 * 60 * 60))

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-blue-800">Daily API Usage</h3>
          <p className="text-sm text-blue-600">
            {rateLimitInfo.remaining} of {rateLimitInfo.limit} requests remaining
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-blue-600">
            Resets in ~{hoursUntilReset}h
          </div>
          <div className="w-20 bg-blue-200 rounded-full h-2 mt-1">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(rateLimitInfo.remaining / rateLimitInfo.limit) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>
      
      {!rateLimitInfo.canMakeRequest && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-800">
            ⚠️ {rateLimitInfo.message}
          </p>
        </div>
      )}
      
      <button 
        onClick={fetchRateLimitStatus}
        disabled={loading}
        className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
      >
        {loading ? 'Refreshing...' : 'Refresh Status'}
      </button>
    </div>
  )
}
