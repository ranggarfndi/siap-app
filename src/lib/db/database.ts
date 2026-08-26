import Dexie, { type Table } from 'dexie'
import type { Submission, Progress, Achievement, Activity, Settings } from '@/types'

export class SiapDatabase extends Dexie {
  submissions!: Table<Submission, number>
  progress!: Table<Progress, number>
  achievements!: Table<Achievement, number>
  activity!: Table<Activity, number>
  settings!: Table<Settings, number>

  constructor() {
    super('siap_local_db')

    this.version(1).stores({
      submissions: '++id, materialId, itemId, method, score, createdAt',
      progress: '++id, &materialId, bestScore, latestScore, averageScore, attemptCount, lastPracticedAt',
      achievements: '++id, &achievementId, unlockedAt',
      activity: '++id, &date',
      settings: '++id',
    })
  }
}

// Singleton instance — safe for SSR (only instantiate client-side)
let _db: SiapDatabase | null = null

export function getDatabase(): SiapDatabase {
  if (typeof window === 'undefined') {
    throw new Error('Database can only be accessed client-side')
  }
  if (!_db) {
    _db = new SiapDatabase()
  }
  return _db
}

export default getDatabase
