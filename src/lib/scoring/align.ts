/**
 * Word alignment using Longest Common Subsequence (LCS) with fuzzy Indonesian matching.
 * Maps user words to reference words to identify correct/incorrect/missing/extra.
 */

export type AlignedWord = {
  refWord: string | null
  userWord: string | null
  status: 'correct' | 'incorrect' | 'missing' | 'extra'
}

function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length
  const n = s2.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))

  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
      }
    }
  }
  return dp[m][n]
}

const EQUIVALENTS: string[][] = [
  ['bertaqwa', 'bertakwa'],
  ['kesatria', 'ksatria', 'kesatrya', 'ksatrya'],
  ['bhayangkari', 'bayangkari', 'bhayangkara', 'bayangkara'],
  ['1945', 'sembilanbelasempatlima', 'seribusembilanratusempatpuluhlima', 'sembilanbelasempatpuluhlima'],
  ['uud', 'undangundangdasar'],
  ['tni', 'tentaranasionalindonesia'],
]

export function isWordMatch(w1: string | null, w2: string | null): boolean {
  if (!w1 || !w2) return false
  if (w1 === w2) return true

  for (const group of EQUIVALENTS) {
    if (group.includes(w1) && group.includes(w2)) return true
  }

  // Allow distance 1 for words with length >= 5 (tolerates speech recognition acoustic artifacts)
  if (w1.length >= 5 && w2.length >= 5) {
    if (levenshteinDistance(w1, w2) <= 1) return true
  }

  return false
}

/**
 * Build LCS matrix with fuzzy Indonesian matching
 */
function buildLCS(a: string[], b: string[]): number[][] {
  const m = a.length
  const n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (isWordMatch(a[i - 1], b[j - 1])) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }
  return dp
}

/**
 * Align user words against reference words using LCS.
 * Returns list of aligned pairs with status.
 */
export function alignWords(userWords: string[], refWords: string[]): AlignedWord[] {
  const dp = buildLCS(userWords, refWords)
  const aligned: AlignedWord[] = []

  let i = userWords.length
  let j = refWords.length

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && isWordMatch(userWords[i - 1], refWords[j - 1])) {
      aligned.unshift({ refWord: refWords[j - 1], userWord: userWords[i - 1], status: 'correct' })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      aligned.unshift({ refWord: refWords[j - 1], userWord: null, status: 'missing' })
      j--
    } else {
      aligned.unshift({ refWord: null, userWord: userWords[i - 1], status: 'extra' })
      i--
    }
  }

  return postProcessAlignment(aligned)
}

function postProcessAlignment(aligned: AlignedWord[]): AlignedWord[] {
  const result = [...aligned]

  for (let i = 0; i < result.length - 1; i++) {
    const curr = result[i]
    const next = result[i + 1]

    // If we have a missing followed by an extra, treat as incorrect substitution
    if (curr.status === 'missing' && next.status === 'extra') {
      result[i] = { refWord: curr.refWord, userWord: next.userWord, status: 'incorrect' }
      result.splice(i + 1, 1)
    }
  }

  return result
}
