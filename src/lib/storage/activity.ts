import getDatabase from '@/lib/db/database'
import type { Activity } from '@/types'

function getTodayString(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export async function recordActivity(type: 'practice' | 'submission'): Promise<void> {
  const db = getDatabase()
  const today = getTodayString()
  const existing = await db.activity.where('date').equals(today).first()

  if (existing && existing.id !== undefined) {
    await db.activity.update(existing.id, {
      practiceCount: existing.practiceCount + (type === 'practice' ? 1 : 0),
      submissionCount: existing.submissionCount + (type === 'submission' ? 1 : 0),
    })
  } else {
    await db.activity.add({
      date: today,
      practiceCount: type === 'practice' ? 1 : 0,
      submissionCount: type === 'submission' ? 1 : 0,
    })
  }
}

export async function getTodayActivity(): Promise<Activity | undefined> {
  const db = getDatabase()
  const today = getTodayString()
  return db.activity.where('date').equals(today).first()
}

export async function getStreak(): Promise<number> {
  const db = getDatabase()
  const allActivity = await db.activity.orderBy('date').reverse().toArray()

  if (allActivity.length === 0) return 0

  const today = getTodayString()
  let streak = 0
  let checkDate = new Date()

  // Check if there's activity today or yesterday (to keep streak alive)
  const latestDate = allActivity[0].date
  const daysDiff = Math.floor(
    (new Date(today).getTime() - new Date(latestDate).getTime()) / (1000 * 60 * 60 * 24)
  )

  if (daysDiff > 1) return 0 // Streak broken

  // Count consecutive days
  for (const activity of allActivity) {
    const expectedDate = new Date(checkDate)
    expectedDate.setDate(expectedDate.getDate() - streak)
    const expectedStr = expectedDate.toISOString().split('T')[0]

    if (activity.date === expectedStr) {
      if (activity.submissionCount > 0 || activity.practiceCount > 0) {
        streak++
      } else {
        break
      }
    } else {
      break
    }
  }

  return streak
}

export async function getActivityLast30Days(): Promise<Activity[]> {
  const db = getDatabase()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const cutoff = thirtyDaysAgo.toISOString().split('T')[0]
  return db.activity.where('date').aboveOrEqual(cutoff).toArray()
}

export async function clearAllActivity(): Promise<void> {
  const db = getDatabase()
  await db.activity.clear()
}
