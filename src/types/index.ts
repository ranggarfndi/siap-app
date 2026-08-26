// ============================
// MATERIAL TYPES
// ============================

export type MaterialId = 'sapta-marga' | 'sumpah-prajurit' | '8-wajib-tni'

export interface MaterialItem {
  id: string
  number: number
  title?: string
  text: string
}

export interface Material {
  id: MaterialId
  name: string
  shortName: string
  description: string
  itemCount: number
  items: MaterialItem[]
  color: string
  icon: string
}

// ============================
// SUBMISSION TYPES
// ============================

export type SubmissionMethod = 'typed' | 'voice'

export type WordStatus = 'correct' | 'incorrect' | 'missing' | 'extra'

export interface WordComparison {
  word: string
  status: WordStatus
  referenceWord?: string
  position: number
}

export interface ComparisonResult {
  userWords: WordComparison[]
  referenceWords: WordComparison[]
  correctCount: number
  incorrectCount: number
  missingCount: number
  extraCount: number
}

export interface ScoreResult {
  score: number
  accuracy: number
  correctWords: number
  incorrectWords: number
  missingWords: number
  extraWords: number
  totalReferenceWords: number
  category: ScoreCategory
  feedback: string
  comparison: ComparisonResult
}

export type ScoreCategory =
  | 'sangat-baik'
  | 'baik'
  | 'cukup'
  | 'perlu-latihan'
  | 'perlu-mengulang'

export interface Submission {
  id?: number
  materialId: MaterialId
  itemId?: string | null
  method: SubmissionMethod
  inputText: string
  transcriptText?: string | null
  score: number
  correctWords: number
  incorrectWords: number
  missingWords: number
  extraWords: number
  durationSeconds?: number | null
  comparisonResult: ComparisonResult
  createdAt: Date
}

// ============================
// PROGRESS TYPES
// ============================

export interface Progress {
  id?: number
  materialId: MaterialId
  bestScore: number
  latestScore: number
  averageScore: number
  attemptCount: number
  lastPracticedAt: Date
  masteryPercent: number
}

// ============================
// ACHIEVEMENT TYPES
// ============================

export type AchievementId =
  | 'first-submission'
  | 'sapta-marga-100'
  | 'sumpah-prajurit-100'
  | '8-wajib-tni-100'
  | 'all-material-100'
  | 'streak-7'
  | 'streak-30'
  | 'submissions-10'
  | 'submissions-30'
  | 'submissions-100'
  | 'perfect-score'
  | 'voice-submission'

export interface AchievementDefinition {
  id: AchievementId
  name: string
  description: string
  icon: string
  xpReward: number
}

export interface Achievement {
  id?: number
  achievementId: AchievementId
  unlockedAt: Date
}

// ============================
// ACTIVITY TYPES
// ============================

export interface Activity {
  id?: number
  date: string // YYYY-MM-DD
  practiceCount: number
  submissionCount: number
}

// ============================
// SETTINGS TYPES
// ============================

export interface Settings {
  id?: number
  dailyTarget: number
  soundEnabled: boolean
  animationEnabled: boolean
  theme: 'dark' | 'light'
  createdAt: Date
  updatedAt: Date
}

// ============================
// GAMIFICATION TYPES
// ============================

export interface XPEvent {
  type: 'practice' | 'submission' | 'score-bonus' | 'perfect' | 'daily-target'
  amount: number
  label: string
}

export interface LevelDefinition {
  level: number
  name: string
  minXP: number
  maxXP: number
}

// ============================
// BACKUP TYPES
// ============================

export interface BackupData {
  version: string
  exportedAt: string
  submissions: Submission[]
  progress: Progress[]
  achievements: Achievement[]
  settings: Partial<Settings>
  activity: Activity[]
}

// ============================
// FLASHCARD TYPES
// ============================

export type FlashcardRating = 'not-memorized' | 'almost' | 'memorized'

export interface FlashcardState {
  itemId: string
  rating: FlashcardRating
  lastRatedAt: Date
}

// ============================
// VOICE RECORDER TYPES
// ============================

export type VoiceRecorderState =
  | 'idle'
  | 'requesting_permission'
  | 'recording'
  | 'processing'
  | 'transcribing'
  | 'completed'
  | 'error'

export interface VoiceRecorderResult {
  transcript: string
  duration: number
}
