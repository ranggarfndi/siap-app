import getDatabase from '@/lib/db/database'
import type { Progress, MaterialId } from '@/types'

export async function getProgress(materialId: MaterialId): Promise<Progress | undefined> {
  const db = getDatabase()
  return db.progress.where('materialId').equals(materialId).first()
}

export async function getAllProgress(): Promise<Progress[]> {
  const db = getDatabase()
  return db.progress.toArray()
}

export async function upsertProgress(
  materialId: MaterialId,
  score: number
): Promise<void> {
  const db = getDatabase()
  const existing = await db.progress.where('materialId').equals(materialId).first()

  if (existing && existing.id !== undefined) {
    const newAttemptCount = existing.attemptCount + 1
    const newAverage = Math.round(
      (existing.averageScore * existing.attemptCount + score) / newAttemptCount
    )
    await db.progress.update(existing.id, {
      latestScore: score,
      bestScore: Math.max(existing.bestScore, score),
      averageScore: newAverage,
      attemptCount: newAttemptCount,
      lastPracticedAt: new Date(),
      masteryPercent: Math.min(100, Math.round((Math.max(existing.bestScore, score) / 100) * 100)),
    })
  } else {
    await db.progress.add({
      materialId,
      bestScore: score,
      latestScore: score,
      averageScore: score,
      attemptCount: 1,
      lastPracticedAt: new Date(),
      masteryPercent: Math.min(100, score),
    })
  }
}

export async function clearAllProgress(): Promise<void> {
  const db = getDatabase()
  await db.progress.clear()
}
