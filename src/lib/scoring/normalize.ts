/**
 * Normalize and tokenize text for scoring comparison.
 * Removes punctuation, lowercases, normalizes whitespace.
 */

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function tokenizeText(text: string): string[] {
  return normalizeText(text)
    .split(' ')
    .filter((w) => w.length > 0)
}
