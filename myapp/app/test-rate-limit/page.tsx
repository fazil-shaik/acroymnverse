'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'

export default function TestRateLimit() {
  const { isSignedIn } = useAuth()
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testRateLimit = async () => {
    if (!isSignedIn) {
      alert('Please sign in first')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/test-rate-limit')
      const data = await res.json()
      setResponse({ status: res.status, data })
    } catch (error) {
      setResponse({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testSearch = async () => {
    if (!isSignedIn) {
      alert('Please sign in first')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/gemini/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'test' })
      })
      const data = await res.json()
      setResponse({ status: res.status, data })
    } catch (error) {
      setResponse({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testCreateAcronym = async () => {
    if (!isSignedIn) {
      alert('Please sign in first')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/acronyms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          acronym: 'TEST',
          fullForm: 'Test Example System Technology',
          industry: 'Technology',
          context: 'For testing rate limits',
          tags: ['test']
        })
      })
      const data = await res.json()
      setResponse({ status: res.status, data })
    } catch (error) {
      setResponse({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const checkRateLimitStatus = async () => {
    if (!isSignedIn) {
      alert('Please sign in first')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/rate-limit/status')
      const data = await res.json()
      setResponse({ status: res.status, data })
    } catch (error) {
      setResponse({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  if (!isSignedIn) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Rate Limit Testing</h1>
        <p>Please sign in to test rate limiting</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Rate Limit Testing</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button 
          onClick={testRateLimit}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Rate Limit Endpoint
        </button>
        
        <button 
          onClick={testSearch}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test Search Endpoint
        </button>
        
        <button 
          onClick={testCreateAcronym}
          disabled={loading}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Test Create Acronym
        </button>
        
        <button 
          onClick={checkRateLimitStatus}
          disabled={loading}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
        >
          Check Rate Limit Status
        </button>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p>Testing...</p>
        </div>
      )}

      {response && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Response:</h2>
          <pre className="bg-black text-green-400 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">Testing Instructions:</h3>
        <ol className="list-decimal list-inside text-yellow-700 space-y-1">
          <li>Click any test button once - should work</li>
          <li>Click the same button again - should work (2nd request)</li>
          <li>Click the same button a third time - should get rate limited (429 error)</li>
          <li>Check rate limit status to see remaining requests and reset time</li>
          <li>Wait until next day or reset the database to test again</li>
        </ol>
      </div>
    </div>
  )
}
