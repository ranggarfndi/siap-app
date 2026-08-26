import getDatabase from '@/lib/db/database'
import type { Submission, MaterialId } from '@/types'

export async function saveSubmission(submission: Omit<Submission, 'id'>): Promise<number> {
  const db = getDatabase()
  return db.submissions.add(submission)
}

export async function getSubmissions(materialId?: MaterialId): Promise<Submission[]> {
  const db = getDatabase()
  if (materialId) {
    return db.submissions.where('materialId').equals(materialId).reverse().sortBy('createdAt')
  }
  return db.submissions.orderBy('createdAt').reverse().toArray()
}

export async function getRecentSubmissions(limit = 10): Promise<Submission[]> {
  const db = getDatabase()
  return db.submissions.orderBy('createdAt').reverse().limit(limit).toArray()
}

export async function getSubmissionById(id: number): Promise<Submission | undefined> {
  const db = getDatabase()
  return db.submissions.get(id)
}

export async function deleteSubmission(id: number): Promise<void> {
  const db = getDatabase()
  await db.submissions.delete(id)
}

export async function clearAllSubmissions(): Promise<void> {
  const db = getDatabase()
  await db.submissions.clear()
}

export async function getSubmissionCount(): Promise<number> {
  const db = getDatabase()
  return db.submissions.count()
}
