import type { LevelDefinition } from '@/types'

export const LEVELS: LevelDefinition[] = [
  { level: 1, name: 'Pemula', minXP: 0, maxXP: 99 },
  { level: 2, name: 'Terlatih', minXP: 100, maxXP: 299 },
  { level: 3, name: 'Konsisten', minXP: 300, maxXP: 599 },
  { level: 4, name: 'Mahir', minXP: 600, maxXP: 999 },
  { level: 5, name: 'Unggul', minXP: 1000, maxXP: Infinity },
]

export function getLevelFromXP(xp: number): LevelDefinition {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i]
  }
  return LEVELS[0]
}

export function getXPForNextLevel(xp: number): { current: number; needed: number; percent: number } {
  const currentLevel = getLevelFromXP(xp)
  const nextLevel = LEVELS.find((l) => l.level === currentLevel.level + 1)

  if (!nextLevel) {
    return { current: xp - currentLevel.minXP, needed: 0, percent: 100 }
  }

  const current = xp - currentLevel.minXP
  const needed = nextLevel.minXP - currentLevel.minXP
  const percent = Math.round((current / needed) * 100)

  return { current, needed, percent }
}
