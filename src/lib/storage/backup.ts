import { z } from 'zod'
import getDatabase from '@/lib/db/database'
import type { BackupData } from '@/types'

export const BackupSchema = z.object({
  version: z.string(),
  exportedAt: z.string(),
  submissions: z.array(z.any()),
  progress: z.array(z.any()),
  achievements: z.array(z.any()),
  settings: z.record(z.string(), z.any()).optional().default({}),
  activity: z.array(z.any()),
})

export async function exportBackup(): Promise<BackupData> {
  const db = getDatabase()
  const [submissions, progress, achievements, settings, activity] = await Promise.all([
    db.submissions.toArray(),
    db.progress.toArray(),
    db.achievements.toArray(),
    db.settings.toArray(),
    db.activity.toArray(),
  ])

  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    submissions,
    progress,
    achievements,
    settings: settings[0] ?? {},
    activity,
  }
}

export async function importBackup(data: BackupData): Promise<void> {
  const db = getDatabase()

  await db.transaction(
    'rw',
    [db.submissions, db.progress, db.achievements, db.settings, db.activity],
    async () => {
      await db.submissions.clear()
      await db.progress.clear()
      await db.achievements.clear()
      await db.settings.clear()
      await db.activity.clear()

      if (data.submissions.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        await db.submissions.bulkAdd(data.submissions.map(({ id: _id, ...rest }) => rest))
      }
      if (data.progress.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        await db.progress.bulkAdd(data.progress.map(({ id: _id, ...rest }) => rest))
      }
      if (data.achievements.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        await db.achievements.bulkAdd(data.achievements.map(({ id: _id, ...rest }) => rest))
      }
      if (data.settings && Object.keys(data.settings).length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, ...settingsRest } = data.settings as Record<string, unknown>
        // Use unknown cast to satisfy Dexie's strict types
        await db.settings.add(settingsRest as unknown as Parameters<typeof db.settings.add>[0])
      }
      if (data.activity.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        await db.activity.bulkAdd(data.activity.map(({ id: _id, ...rest }) => rest))
      }
    }
  )
}

export async function resetAllData(): Promise<void> {
  const db = getDatabase()
  await db.transaction(
    'rw',
    [db.submissions, db.progress, db.achievements, db.activity],
    async () => {
      await db.submissions.clear()
      await db.progress.clear()
      await db.achievements.clear()
      await db.activity.clear()
    }
  )
}

export function downloadJson(data: BackupData): void {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `siap-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}
