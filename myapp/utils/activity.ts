export async function logActivity(action: string, acronym: string, acronymId?: string, metadata?: any) {
  try {
    await fetch('/api/activity/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        acronym,
        acronymId,
        metadata
      })
    })
  } catch (error) {
    console.error('Error logging activity:', error)
  }
}

export function formatTimeAgo(timestamp: string | Date): string {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} hours ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} days ago`
  
  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`
  
  return time.toLocaleDateString()
}
