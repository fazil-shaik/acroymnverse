'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sparkles, TrendingUp, Users, Zap, Heart, AlertCircle } from 'lucide-react'

interface SearchResult {
  acronym: string
  fullForm: string
  industry: string
  context: string
  popularity: number
  trending: boolean
  tags: string[]
  emoji: string
}

interface RateLimitError {
  error: string
  rateLimited: boolean
  resetTime: string
  searchesRemaining: number
}

interface AcronymSearchProps {
  theme: 'light' | 'dark'
}

export default function AcronymSearch({ theme }: AcronymSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [rateLimitError, setRateLimitError] = useState<RateLimitError | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setHasSearched(true)
    setRateLimitError(null)
    
    try {
      const response = await fetch('/api/gemini/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() }),
      })

      const data = await response.json()

      if (response.status === 429) {
        // Rate limit exceeded
        setRateLimitError(data)
        setResults([])
        return
      }

      if (!response.ok) throw new Error('Search failed')
      
      setResults(data.results || [])
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const getIndustryIcon = (industry: string) => {
    const icons: Record<string, string> = {
      'Technology': '💻',
      'Social Media': '📱',
      'Entertainment': '🎭',
      'Business': '💼',
      'Education': '📚',
      'Healthcare': '🏥',
      'Finance': '💰',
      'Gaming': '🎮',
    }
    return icons[industry] || '🌟'
  }

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 90) return 'from-green-400 to-emerald-500'
    if (popularity >= 70) return 'from-yellow-400 to-orange-500'
    return 'from-blue-400 to-purple-500'
  }

  return (
    <div className={`w-full max-w-4xl mx-auto p-4 md:p-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="text-center mb-4 md:mb-6">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            ✨ Discover Acronyms ✨
          </motion.h2>
          <p className={`text-base md:text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Type any word and we&apos;ll generate the most fire acronyms! 🔥
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter a word to discover acronyms..."
                className={`w-full pl-12 pr-4 py-3 md:py-4 rounded-2xl border-2 transition-all duration-300 text-base md:text-lg
                  ${theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:bg-gray-700' 
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:border-purple-500 focus:bg-gray-50'
                  }
                  focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading || !query.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-2xl font-bold text-base md:text-lg
                hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Find
                </span>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Results Section */}
      <AnimatePresence>
        {rateLimitError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Rate Limit Exceeded
              </h3>
              <p className="text-red-700 mb-4">
                {rateLimitError.error}
              </p>
              <div className="text-sm text-red-600">
                <p>Searches remaining: <strong>{rateLimitError.searchesRemaining}</strong></p>
                <p>Resets: <strong>{new Date(rateLimitError.resetTime).toLocaleString()}</strong></p>
              </div>
            </div>
          </motion.div>
        )}
        
        {hasSearched && !rateLimitError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    className={`h-64 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}
                  />
                ))}
              </div>
            ) : results.length > 0 ? (
              <>
                <motion.h3 
                  className={`text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  🔥 Top 3 Industry Meanings for &quot;<span className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">{query.toUpperCase()}</span>&quot;
                </motion.h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {results.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 50, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }}
                      whileHover={{ 
                        scale: 1.05, 
                        rotate: Math.random() * 4 - 2,
                        transition: { duration: 0.2 }
                      }}
                      className={`relative overflow-hidden rounded-2xl p-4 md:p-6 cursor-pointer group
                        ${theme === 'dark' 
                          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                          : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
                        }
                        shadow-lg hover:shadow-2xl transition-all duration-300`}
                    >
                      {/* Trending Badge */}
                      {result.trending && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                          className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1"
                        >
                          <TrendingUp className="w-3 h-3" />
                          TRENDING
                        </motion.div>
                      )}

                      {/* Main Content */}
                      <div className="space-y-4">
                        {/* Acronym Header */}
                        <div className="text-center">
                          <motion.div 
                            className="text-3xl md:text-4xl mb-2"
                            animate={{ 
                              rotate: [0, 10, -10, 0],
                              scale: [1, 1.1, 1]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              repeatDelay: 3
                            }}
                          >
                            {result.emoji}
                          </motion.div>
                          <h4 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                            {result.acronym}
                          </h4>
                        </div>

                        {/* Full Form */}
                        <div className={`text-center p-2 md:p-3 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                          <p className="font-semibold text-base md:text-lg">{result.fullForm}</p>
                        </div>

                        {/* Industry */}
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xl">{getIndustryIcon(result.industry)}</span>
                          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            {result.industry}
                          </span>
                        </div>

                        {/* Context */}
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                          {result.context}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 justify-center">
                          {result.tags.map((tag, tagIndex) => (
                            <motion.span
                              key={tagIndex}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 + tagIndex * 0.05 + 0.5 }}
                              className={`text-xs px-2 py-1 rounded-full font-medium
                                ${theme === 'dark' 
                                  ? 'bg-purple-500/20 text-purple-300' 
                                  : 'bg-purple-100 text-purple-700'
                                }`}
                            >
                              #{tag}
                            </motion.span>
                          ))}
                        </div>

                        {/* Popularity Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                              Popularity
                            </span>
                            <span className="font-bold">{result.popularity}%</span>
                          </div>
                          <div className={`w-full h-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${result.popularity}%` }}
                              transition={{ delay: index * 0.1 + 0.7, duration: 1 }}
                              className={`h-full rounded-full bg-gradient-to-r ${getPopularityColor(result.popularity)}`}
                            />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 justify-center pt-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`p-2 rounded-full transition-colors
                              ${theme === 'dark' 
                                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                              }`}
                          >
                            <Heart className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`p-2 rounded-full transition-colors
                              ${theme === 'dark' 
                                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                              }`}
                          >
                            <Users className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`p-2 rounded-full transition-colors
                              ${theme === 'dark' 
                                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                              }`}
                          >
                            <Zap className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Hover Effect Overlay */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                        initial={false}
                      />
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">🤔</div>
                <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  No results found. Try a different word!
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
