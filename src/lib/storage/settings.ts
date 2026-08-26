import getDatabase from '@/lib/db/database'
import type { Settings } from '@/types'

const DEFAULT_SETTINGS: Omit<Settings, 'id'> = {
  dailyTarget: 3,
  soundEnabled: true,
  animationEnabled: true,
  theme: 'dark',
  createdAt: new Date(),
  updatedAt: new Date(),
}

export async function getSettings(): Promise<Settings> {
  const db = getDatabase()
  const all = await db.settings.toArray()
  if (all.length === 0) {
    const id = await db.settings.add(DEFAULT_SETTINGS)
    return { ...DEFAULT_SETTINGS, id }
  }
  return all[0]
}

export async function updateSettings(partial: Partial<Omit<Settings, 'id' | 'createdAt'>>): Promise<void> {
  const db = getDatabase()
  const existing = await db.settings.toArray()
  if (existing.length > 0 && existing[0].id !== undefined) {
    await db.settings.update(existing[0].id, { ...partial, updatedAt: new Date() })
  } else {
    await db.settings.add({ ...DEFAULT_SETTINGS, ...partial })
  }
}

export async function clearSettings(): Promise<void> {
  const db = getDatabase()
  await db.settings.clear()
}
