const XP_KEY = 'siap_xp'

export type XPEventType = 'practice' | 'submission' | 'score-bonus' | 'perfect' | 'daily-target'

export const XP_REWARDS: Record<XPEventType, number> = {
  practice: 5,
  submission: 10,
  'score-bonus': 5,
  perfect: 10,
  'daily-target': 10,
}

export function getXP(): number {
  if (typeof window === 'undefined') return 0
  return parseInt(localStorage.getItem(XP_KEY) ?? '0', 10)
}

export function addXP(amount: number): number {
  const current = getXP()
  const newXP = current + amount
  localStorage.setItem(XP_KEY, String(newXP))
  return newXP
}

export function awardXPForSubmission(score: number): number {
  let total = XP_REWARDS.submission
  if (score >= 90) total += XP_REWARDS['score-bonus']
  if (score === 100) total += XP_REWARDS.perfect
  return addXP(total)
}

export function awardXPForPractice(): number {
  return addXP(XP_REWARDS.practice)
}
