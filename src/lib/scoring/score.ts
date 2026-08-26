import { tokenizeText } from './normalize'
import { alignWords } from './align'
import type { ScoreResult, ComparisonResult, WordComparison, ScoreCategory } from '@/types'

export function generateComparison(
  userText: string,
  referenceText: string
): ComparisonResult {
  const userWords = tokenizeText(userText)
  const refWords = tokenizeText(referenceText)

  const aligned = alignWords(userWords, refWords)

  const userComparisons: WordComparison[] = []
  const refComparisons: WordComparison[] = []

  let correctCount = 0
  let incorrectCount = 0
  let missingCount = 0
  let extraCount = 0

  let userPos = 0
  let refPos = 0

  for (const pair of aligned) {
    if (pair.status === 'correct') {
      userComparisons.push({ word: pair.userWord!, status: 'correct', position: userPos++ })
      refComparisons.push({ word: pair.refWord!, status: 'correct', position: refPos++ })
      correctCount++
    } else if (pair.status === 'incorrect') {
      userComparisons.push({
        word: pair.userWord!,
        status: 'incorrect',
        referenceWord: pair.refWord ?? undefined,
        position: userPos++,
      })
      refComparisons.push({
        word: pair.refWord!,
        status: 'incorrect',
        referenceWord: pair.userWord ?? undefined,
        position: refPos++,
      })
      incorrectCount++
    } else if (pair.status === 'missing') {
      refComparisons.push({ word: pair.refWord!, status: 'missing', position: refPos++ })
      missingCount++
    } else if (pair.status === 'extra') {
      userComparisons.push({ word: pair.userWord!, status: 'extra', position: userPos++ })
      extraCount++
    }
  }

  return {
    userWords: userComparisons,
    referenceWords: refComparisons,
    correctCount,
    incorrectCount,
    missingCount,
    extraCount,
  }
}

export function calculateScore(comparison: ComparisonResult): number {
  const totalRef = comparison.correctCount + comparison.incorrectCount + comparison.missingCount
  if (totalRef === 0) return 0

  const penaltyForIncorrect = comparison.incorrectCount * 0.5
  const penaltyForExtra = comparison.extraCount * 0.3

  const rawScore = Math.max(
    0,
    ((comparison.correctCount - penaltyForIncorrect - penaltyForExtra) / totalRef) * 100
  )

  return Math.round(Math.min(100, Math.max(0, rawScore)))
}

export function getScoreCategory(score: number): ScoreCategory {
  if (score >= 95) return 'sangat-baik'
  if (score >= 85) return 'baik'
  if (score >= 70) return 'cukup'
  if (score >= 50) return 'perlu-latihan'
  return 'perlu-mengulang'
}

export function generateFeedback(score: number): string {
  if (score >= 95) return 'Luar biasa! Hafalanmu sangat baik. Pertahankan konsistensimu.'
  if (score >= 85) return 'Bagus! Hafalanmu sudah baik. Ada beberapa bagian yang perlu diperbaiki.'
  if (score >= 70) return 'Cukup baik. Pelajari kembali bagian yang masih terlewat.'
  return 'Ayo ulangi kembali materinya. Fokus pada bagian yang diberi tanda.'
}

export function scoreSubmission(userText: string, referenceText: string): ScoreResult {
  const comparison = generateComparison(userText, referenceText)
  const score = calculateScore(comparison)
  const category = getScoreCategory(score)
  const feedback = generateFeedback(score)

  return {
    score,
    accuracy: score,
    correctWords: comparison.correctCount,
    incorrectWords: comparison.incorrectCount,
    missingWords: comparison.missingCount,
    extraWords: comparison.extraCount,
    totalReferenceWords:
      comparison.correctCount + comparison.incorrectCount + comparison.missingCount,
    category,
    feedback,
    comparison,
  }
}
