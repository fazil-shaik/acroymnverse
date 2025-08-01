export interface UserActivity {
  _id?: string
  userId: string
  action: 'created' | 'voted' | 'commented' | 'shared' | 'liked' | 'searched' | 'followed' | 'achievement' | 'deleted'
  acronym: string
  acronymId?: string
  timestamp: Date
  metadata?: {
    fromPage?: string
    searchQuery?: string
    achievementTitle?: string
    deletedAcronymId?: string
    [key: string]: any
  }
}

export interface Acronym {
  _id?: string
  acronym: string
  fullForm: string
  industry: string
  context: string
  popularity: number
  trending: boolean
  tags: string[]
  emoji: string
  createdBy: string
  createdAt: Date
  votes: number
  votedBy: string[]
  comments: Comment[]
}

export interface Comment {
  _id?: string
  userId: string
  userName: string
  text: string
  timestamp: Date
  likes: number
  likedBy: string[]
}

export interface UserStats {
  _id?: string
  userId: string
  acronymsCreated: number
  votesGiven: number
  votesReceived: number
  followers: number
  following: number
  searchCount: number
  lastActivity: Date
}

export interface UserAchievement {
  _id?: string
  userId: string
  achievementId: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress: number
  unlockedAt?: Date
  category: string
}
