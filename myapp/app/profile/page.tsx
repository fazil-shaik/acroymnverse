'use client'
import { useUser, useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface UserStats {
  acronymsCreated: number
  votesReceived: number
  votesGiven: number
  searchCount: number
  followers: number
  following: number
  lastActivity: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress: number
  date?: string
}

interface UserAcronym {
  _id: string
  acronym: string
  fullForm: string
  votes: number
  createdAt: string
  industry?: string
}

interface Activity {
  id: string
  action: string
  acronym: string
  timestamp: string
  description: string
}

interface ProfileData {
  stats: UserStats
  achievements: Achievement[]
  acronyms: UserAcronym[]
  recentActivities: Activity[]
}

export default function Profile() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isLoaded && user) {
      fetchProfileData()
    }
  }, [isLoaded, user])

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/profile')
      if (!response.ok) {
        throw new Error('Failed to fetch profile data')
      }
      const data = await response.json()
      setProfileData(data)
    } catch (err) {
      console.error('Error fetching profile data:', err)
      setError('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return 'Recently'
    }
  }

  const getTimeAgo = (dateString: string) => {
    try {
      const now = new Date()
      const date = new Date(dateString)
      const diffInMs = now.getTime() - date.getTime()
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
      
      if (diffInDays === 0) return 'Today'
      if (diffInDays === 1) return '1 day ago'
      if (diffInDays < 7) return `${diffInDays} days ago`
      if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
      return `${Math.floor(diffInDays / 30)} months ago`
    } catch {
      return 'Recently'
    }
  }

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'created': return '🎨'
      case 'voted': return '👍'
      case 'searched': return '🔍'
      case 'commented': return '💬'
      case 'followed': return '👥'
      case 'achievement': return '🏆'
      default: return '📝'
    }
  }

  const getActivityColor = (action: string) => {
    switch (action) {
      case 'created': return 'bg-green-50 text-green-600'
      case 'voted': return 'bg-teal-50 text-teal-600'
      case 'searched': return 'bg-blue-50 text-blue-600'
      case 'commented': return 'bg-purple-50 text-purple-600'
      case 'followed': return 'bg-yellow-50 text-yellow-600'
      case 'achievement': return 'bg-orange-50 text-orange-600'
      default: return 'bg-gray-50 text-gray-600'
    }
  }

  const handleSignOut = async () => {
    setIsLoggingOut(true)
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
      setIsLoggingOut(false)
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-300 via-green-300 to-teal-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4 text-lg">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-300 via-green-300 to-teal-300">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-white text-2xl font-bold mb-2">Error Loading Profile</h2>
          <p className="text-white mb-4">{error}</p>
          <button 
            onClick={fetchProfileData}
            className="bg-white text-green-700 px-6 py-2 rounded-full hover:bg-gray-100 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-300 via-green-300 to-teal-300">
      {/* Header */}
      <header className="bg-white bg-opacity-80 shadow-md p-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/dashboard" className="text-xl md:text-2xl font-bold text-green-700 hover:text-green-800 transition">
              AcronymVerse 🚀
            </Link>
            <span className="text-gray-400 text-sm md:text-base">/ Profile</span>
          </div>
          <Link href="/dashboard" className="bg-green-400 text-white px-4 py-2 rounded-full hover:bg-green-500 transition text-sm md:text-base w-full sm:w-auto text-center">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Profile Header */}
        <div className="bg-white bg-opacity-80 rounded-xl p-6 shadow-lg mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-teal-400 rounded-full flex items-center justify-center text-3xl text-white font-bold">
              {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0) || '👤'}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : user?.firstName || 'User'}
              </h1>
              <p className="text-gray-600">{user?.emailAddresses[0]?.emailAddress}</p>
              <p className="text-sm text-gray-500 mt-1">
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
              </p>
              <div className="flex gap-4 mt-3">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  🎯 {profileData?.stats.acronymsCreated || 0} Created
                </span>
                <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm">
                  ⭐ {profileData?.stats.votesReceived || 0} Votes
                </span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  � {profileData?.stats.searchCount || 0} Searches
                </span>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              disabled={isLoggingOut}
              className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoggingOut ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Signing out...
                </>
              ) : (
                <>
                  🚪 Sign Out
                </>
              )}
            </button>
          </div>
        </div>

        {/* Profile Navigation */}
        <div className="bg-white bg-opacity-80 rounded-xl p-4 shadow-lg mb-6">
          <nav className="flex flex-wrap gap-2 md:gap-6">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-3 md:px-4 py-2 rounded-full transition text-sm md:text-base ${activeTab === 'overview' ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-600 hover:text-green-700'}`}
            >
              📊 Overview
            </button>
            <button 
              onClick={() => setActiveTab('achievements')}
              className={`px-3 md:px-4 py-2 rounded-full transition text-sm md:text-base ${activeTab === 'achievements' ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-600 hover:text-green-700'}`}
            >
              🏆 Achievements
            </button>
            <button 
              onClick={() => setActiveTab('my-acronyms')}
              className={`px-3 md:px-4 py-2 rounded-full transition text-sm md:text-base ${activeTab === 'my-acronyms' ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-600 hover:text-green-700'}`}
            >
              📝 My Acronyms
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`px-3 md:px-4 py-2 rounded-full transition text-sm md:text-base ${activeTab === 'settings' ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-600 hover:text-green-700'}`}
            >
              ⚙️ Settings
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white bg-opacity-80 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📈 Your Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Acronyms Created</span>
                  <span className="font-bold text-green-700">{profileData?.stats.acronymsCreated || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Votes Received</span>
                  <span className="font-bold text-teal-700">{profileData?.stats.votesReceived || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Votes Given</span>
                  <span className="font-bold text-blue-700">{profileData?.stats.votesGiven || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Searches Made</span>
                  <span className="font-bold text-purple-700">{profileData?.stats.searchCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Followers</span>
                  <span className="font-bold text-purple-700">{profileData?.stats.followers || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Following</span>
                  <span className="font-bold text-gray-700">{profileData?.stats.following || 0}</span>
                </div>
              </div>
            </div>
            <div className="bg-white bg-opacity-80 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Recent Activity</h3>
              <div className="space-y-3">
                {profileData?.recentActivities.length ? (
                  profileData.recentActivities.slice(0, 4).map((activity, index) => (
                    <div key={activity.id || index} className={`flex items-center gap-3 p-2 rounded-lg ${getActivityColor(activity.action)}`}>
                      <span>{getActivityIcon(activity.action)}</span>
                      <span className="text-sm text-gray-700 flex-1">{activity.description}</span>
                      <span className="text-xs text-gray-500">{getTimeAgo(activity.timestamp)}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    <div className="text-4xl mb-2">🌟</div>
                    <p>No recent activity</p>
                    <p className="text-sm">Start exploring to see your activity here!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🏆 Your Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profileData?.achievements.map((achievement, index) => (
                <div key={achievement.id || index} className={`bg-white bg-opacity-80 rounded-xl p-6 shadow-lg border-2 ${achievement.unlocked ? 'border-green-200' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`text-3xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold ${achievement.unlocked ? 'text-green-700' : 'text-gray-500'}`}>
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      {achievement.unlocked ? (
                        <p className="text-xs text-green-600 mt-1">
                          Unlocked on {achievement.date ? formatDate(achievement.date) : 'Recently'}
                        </p>
                      ) : (
                        <div className="mt-2">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-400 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${Math.min(100, achievement.progress)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{Math.floor(achievement.progress)}% complete</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )) || (
                <div className="col-span-2 text-center text-gray-500 py-8">
                  <div className="text-6xl mb-4">🏆</div>
                  <p className="text-lg">No achievements yet</p>
                  <p>Start creating and voting to unlock achievements!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'my-acronyms' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📝 Your Created Acronyms</h2>
            {profileData?.acronyms.length ? (
              profileData.acronyms.map((acronym, index) => (
                <div key={acronym._id || index} className="bg-white bg-opacity-80 rounded-xl p-6 shadow-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-green-700">{acronym.acronym}</h3>
                      <p className="text-gray-600 mb-2">{acronym.fullForm}</p>
                      {acronym.industry && (
                        <p className="text-sm text-blue-600 mb-2">🏢 {acronym.industry}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>👍 {acronym.votes || 0} votes</span>
                        <span>📅 Created {getTimeAgo(acronym.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition">
                        ✏️ Edit
                      </button>
                      <button className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm hover:bg-red-200 transition">
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold mb-2">No acronyms created yet</h3>
                <p className="mb-4">Start creating acronyms to see them here!</p>
                <Link href="/dashboard" className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition">
                  Create Your First Acronym
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white bg-opacity-80 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">⚙️ Account Settings</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">First Name</label>
                    <input type="text" value={user?.firstName || ''} readOnly className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Last Name</label>
                    <input type="text" value={user?.lastName || ''} readOnly className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                    <input type="email" value={user?.emailAddresses[0]?.emailAddress || ''} readOnly className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">To update your profile information, please use Clerk&apos;s user management.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Preferences</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="text-gray-700">Email notifications for new acronyms</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="text-gray-700">Show in leaderboards</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="text-gray-700">Weekly digest emails</span>
                  </label>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-red-600 mb-3">Danger Zone</h3>
                <button className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition">
                  🗑️ Delete Account
                </button>
                <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
