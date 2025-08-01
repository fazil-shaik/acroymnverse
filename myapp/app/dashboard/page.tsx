'use client'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun, RefreshCw } from 'lucide-react'
import { useTheme } from '../../components/ThemeProvider'
import AcronymSearch from '../../components/AcronymSearch'
import RateLimitStatus from '../../components/RateLimitStatus'

interface DashboardData {
  userStats: {
    acronymsCreated: number
    totalVotes: number
    totalVotesReceived: number
    followers: number
    following: number
    searchCount: number
    lastActivity: string
    joinedAt: string
    achievements: string[]
  }
  recentActivities: Array<{
    id: string
    action: string
    acronym: string
    timestamp: string
    metadata?: Record<string, unknown>
  }>
  trendingAcronyms: Array<{
    id: string
    acronym: string
    fullForm: string
    industry: string
    context: string
    popularity: number
    trending: boolean
    tags: string[]
    emoji: string
    votes: number
  }>
}

export default function Dashboard() {
  const { user, isLoaded } = useUser()
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('search')
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchDashboardData = async () => {
    try {
      const [dashboardResponse, trendingResponse] = await Promise.all([
        fetch('/api/dashboard'),
        fetch('/api/trending')
      ])
      
      if (dashboardResponse.ok && trendingResponse.ok) {
        const [dashboardData, trendingData] = await Promise.all([
          dashboardResponse.json(),
          trendingResponse.json()
        ])
        
        setDashboardData({
          ...dashboardData,
          trendingAcronyms: trendingData.acronyms
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await fetchDashboardData()
  }

  useEffect(() => {
    if (isLoaded && user) {
      fetchDashboardData()
    }
  }, [isLoaded, user])

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    if (diffInHours < 48) return '1 day ago'
    return `${Math.floor(diffInHours / 24)} days ago`
  }

  if (!isLoaded || loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen transition-colors duration-300
        ${theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900' 
          : 'bg-gradient-to-br from-gray-300 via-green-300 to-teal-300'
        }`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-300
      ${theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-pink-900 to-teal-900' 
        : 'bg-gradient-to-br from-gray-100 via-pink-100 to-teal-100'
      }`}>
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`shadow-lg transition-colors duration-300
          ${theme === 'dark' 
            ? 'bg-gray-800/80 backdrop-blur-lg border-b border-gray-700' 
            : 'bg-white/80 backdrop-blur-lg'
          }`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <div className="flex items-center gap-4">
            <motion.h1 
              className={`text-2xl font-bold transition-colors duration-300
                ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
              whileHover={{ scale: 1.05 }}
            >
              AcronymVerse 🚀
            </motion.h1>
            <nav className="hidden md:flex gap-6">
              <button 
                onClick={() => setActiveTab('search')}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-sm ${
                  activeTab === 'search' 
                    ? theme === 'dark' 
                      ? 'bg-gradient-to-r from-pink-600 to-teal-600 text-white shadow-pink-500/25' 
                      : 'bg-gradient-to-r from-pink-500 to-teal-500 text-white shadow-pink-500/25'
                    : theme === 'dark'
                      ? 'text-gray-200 hover:text-white hover:bg-gray-700 border border-gray-600'
                      : 'text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-pink-400 hover:to-teal-400 border border-gray-300'
                }`}
              >
                🔍 Search
              </button>
              <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-sm ${
                  activeTab === 'overview' 
                    ? theme === 'dark' 
                      ? 'bg-gradient-to-r from-pink-600 to-teal-600 text-white shadow-pink-500/25' 
                      : 'bg-gradient-to-r from-pink-500 to-teal-500 text-white shadow-pink-500/25'
                    : theme === 'dark'
                      ? 'text-gray-200 hover:text-white hover:bg-gray-700 border border-gray-600'
                      : 'text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-pink-400 hover:to-teal-400 border border-gray-300'
                }`}
              >
                📊 Overview
              </button>
              <button 
                onClick={() => setActiveTab('trending')}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-sm ${
                  activeTab === 'trending' 
                    ? theme === 'dark' 
                      ? 'bg-gradient-to-r from-pink-600 to-teal-600 text-white shadow-pink-500/25' 
                      : 'bg-gradient-to-r from-pink-500 to-teal-500 text-white shadow-pink-500/25'
                    : theme === 'dark'
                      ? 'text-gray-200 hover:text-white hover:bg-gray-700 border border-gray-600'
                      : 'text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-pink-400 hover:to-teal-400 border border-gray-300'
                }`}
              >
                🔥 Trending
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              onClick={refreshData}
              disabled={refreshing}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full transition-colors duration-300 disabled:opacity-50
                ${theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600 text-blue-400' 
                  : 'bg-gray-200 hover:bg-gray-300 text-blue-600'
                }`}
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </motion.button>
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full transition-colors duration-300
                ${theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
            <span className={`font-medium transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Hey, {user?.firstName || 'User'}! ✨
            </span>
            <Link href="/profile" className={`px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg
              ${theme === 'dark' 
                ? 'bg-gradient-to-r from-pink-600 to-teal-600 hover:from-pink-700 hover:to-teal-700 text-white' 
                : 'bg-gradient-to-r from-pink-500 to-teal-500 hover:from-pink-600 hover:to-teal-600 text-white'
              }`}>
              👤 Profile
            </Link>
          </div>
        </div>
      </motion.header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Search Tab */}
        {activeTab === 'search' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <RateLimitStatus />
            <AcronymSearch theme={theme} />
          </motion.div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Welcome Section */}
            <motion.div 
              className={`rounded-xl p-6 shadow-lg transition-colors duration-300
                ${theme === 'dark' 
                  ? 'bg-gray-800/80 backdrop-blur-lg border border-gray-700' 
                  : 'bg-white/80 backdrop-blur-lg'
                }`}
              whileHover={{ scale: 1.02 }}
            >
              <h2 className={`text-3xl font-bold mb-2 transition-colors duration-300
                ${theme === 'dark' ? 'text-white' : 'text-green-700'}`}>
                Welcome back, {user?.firstName}! 🎉
              </h2>
              <p className={`transition-colors duration-300
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {dashboardData?.userStats ? 
                  `You've been active since ${new Date(dashboardData.userStats.joinedAt).toLocaleDateString()}. Keep exploring acronyms!` :
                  'Ready to dive into the world of acronyms?'
                }
              </p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { 
                  label: 'Acronyms Created', 
                  value: dashboardData?.userStats?.acronymsCreated || 0, 
                  color: 'text-green-400',
                  emoji: '🎨'
                },
                { 
                  label: 'Total Votes Given', 
                  value: dashboardData?.userStats?.totalVotes || 0, 
                  color: 'text-teal-400',
                  emoji: '👍'
                },
                { 
                  label: 'Votes Received', 
                  value: dashboardData?.userStats?.totalVotesReceived || 0, 
                  color: 'text-blue-400',
                  emoji: '⭐'
                },
                { 
                  label: 'Searches Made', 
                  value: dashboardData?.userStats?.searchCount || 0, 
                  color: 'text-purple-400',
                  emoji: '🔍'
                }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-xl p-4 shadow-lg text-center transition-colors duration-300
                    ${theme === 'dark' 
                      ? 'bg-gray-800/80 backdrop-blur-lg border border-gray-700' 
                      : 'bg-white/80 backdrop-blur-lg'
                    }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl mb-2">{stat.emoji}</div>
                  <div className={`text-2xl font-bold transition-colors duration-300 ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className={`text-sm transition-colors duration-300
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity */}
            <motion.div 
              className={`rounded-xl p-6 shadow-lg transition-colors duration-300
                ${theme === 'dark' 
                  ? 'bg-gray-800/80 backdrop-blur-lg border border-gray-700' 
                  : 'bg-white/80 backdrop-blur-lg'
                }`}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className={`text-xl font-bold mb-4 transition-colors duration-300
                ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                Recent Activity
              </h3>
              <div className="space-y-3">
                {dashboardData?.recentActivities && dashboardData.recentActivities.length > 0 ? (
                  dashboardData.recentActivities.map((activity, index) => (
                    <motion.div 
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0 transition-colors duration-300
                        ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          {activity.action === 'searched' ? '🔍' :
                           activity.action === 'created' ? '🎨' :
                           activity.action === 'voted' ? '👍' :
                           activity.action === 'commented' ? '💬' : '📝'}
                        </span>
                        <div>
                          <span className={`transition-colors duration-300 capitalize
                            ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {activity.action}{' '}
                          </span>
                          <span className={`font-semibold transition-colors duration-300
                            ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                            {activity.acronym}
                          </span>
                        </div>
                      </div>
                      <span className={`text-sm transition-colors duration-300
                        ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <div className={`text-center py-8 transition-colors duration-300
                    ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    <div className="text-4xl mb-2">🌟</div>
                    <p>No recent activity yet. Start exploring acronyms!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Trending Tab */}
        {activeTab === 'trending' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <h2 className={`text-2xl font-bold transition-colors duration-300
                ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                🔥 Trending Acronyms
              </h2>
              <motion.button
                onClick={refreshData}
                disabled={refreshing}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full transition-all duration-300 disabled:opacity-50
                  ${theme === 'dark' 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'bg-green-100 hover:bg-green-200 text-green-700'
                  }`}
              >
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </motion.button>
            </div>
            
            {dashboardData?.trendingAcronyms && dashboardData.trendingAcronyms.length > 0 ? (
              dashboardData.trendingAcronyms.map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300
                    ${theme === 'dark' 
                      ? 'bg-gray-800/80 backdrop-blur-lg border border-gray-700 hover:border-purple-500' 
                      : 'bg-white/80 backdrop-blur-lg hover:border-green-300'
                    }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{item.emoji}</span>
                        <h3 className={`text-xl font-bold transition-colors duration-300
                          ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                          {item.acronym}
                        </h3>
                        {item.trending && (
                          <motion.span 
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold"
                          >
                            🔥 TRENDING
                          </motion.span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded-full transition-colors duration-300
                          ${theme === 'dark' 
                            ? 'bg-gray-700 text-gray-300' 
                            : 'bg-gray-200 text-gray-700'
                          }`}>
                          {item.industry}
                        </span>
                      </div>
                      <p className={`text-lg font-semibold mb-2 transition-colors duration-300
                        ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        {item.fullForm}
                      </p>
                      <p className={`mb-3 transition-colors duration-300
                        ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {item.context}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.tags.map((tag, tagIndex) => (
                          <span 
                            key={tagIndex}
                            className={`text-xs px-2 py-1 rounded-full transition-colors duration-300
                              ${theme === 'dark' 
                                ? 'bg-purple-500/20 text-purple-300' 
                                : 'bg-purple-100 text-purple-700'
                              }`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`flex items-center gap-1 transition-colors duration-300
                              ${theme === 'dark' 
                                ? 'text-teal-400 hover:text-teal-300' 
                                : 'text-teal-600 hover:text-teal-700'
                              }`}
                          >
                            <span>👍</span>
                            <span>{item.votes}</span>
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`transition-colors duration-300
                              ${theme === 'dark' 
                                ? 'text-gray-400 hover:text-gray-300' 
                                : 'text-gray-500 hover:text-gray-700'
                              }`}
                          >
                            💬 Comment
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`transition-colors duration-300
                              ${theme === 'dark' 
                                ? 'text-gray-400 hover:text-gray-300' 
                                : 'text-gray-500 hover:text-gray-700'
                              }`}
                          >
                            📤 Share
                          </motion.button>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm transition-colors duration-300
                            ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Popularity
                          </div>
                          <div className={`font-bold transition-colors duration-300
                            ${item.popularity >= 90 ? 'text-green-400' : 
                              item.popularity >= 70 ? 'text-yellow-400' : 'text-blue-400'}`}>
                            {item.popularity}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-center py-12 rounded-xl transition-colors duration-300
                  ${theme === 'dark' 
                    ? 'bg-gray-800/80 backdrop-blur-lg border border-gray-700' 
                    : 'bg-white/80 backdrop-blur-lg'
                  }`}
              >
                <div className="text-6xl mb-4">🌟</div>
                <h3 className={`text-xl font-bold mb-2 transition-colors duration-300
                  ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  No Trending Acronyms Yet
                </h3>
                <p className={`transition-colors duration-300
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Be the first to create and vote on acronyms to see them trending!
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
