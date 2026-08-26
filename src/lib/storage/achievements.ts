import getDatabase from '@/lib/db/database'
import type { Achievement, AchievementId } from '@/types'

export async function getAchievements(): Promise<Achievement[]> {
  const db = getDatabase()
  return db.achievements.toArray()
}

export async function isAchievementUnlocked(id: AchievementId): Promise<boolean> {
  const db = getDatabase()
  const found = await db.achievements.where('achievementId').equals(id).first()
  return !!found
}

export async function unlockAchievement(id: AchievementId): Promise<boolean> {
  const db = getDatabase()
  const existing = await db.achievements.where('achievementId').equals(id).first()
  if (existing) return false // already unlocked

  await db.achievements.add({ achievementId: id, unlockedAt: new Date() })
  return true
}

export async function clearAllAchievements(): Promise<void> {
  const db = getDatabase()
  await db.achievements.clear()
}
