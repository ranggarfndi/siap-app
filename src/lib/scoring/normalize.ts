/**
 * Normalize and tokenize text for scoring comparison.
 * Handles spoken preamble, spoken numbers, Indonesian phonetic variations,
 * and punctuation removal.
 */

export function normalizeRecitationText(text: string): string {
  let cleaned = text.toLowerCase()

  // 1. Normalize Indonesian spoken year "1945"
  cleaned = cleaned
    .replace(/seribu sembilan ratus empat puluh lima/gi, ' 1945 ')
    .replace(/sembilan belas empat puluh lima/gi, ' 1945 ')
    .replace(/sembilan belas empat lima/gi, ' 1945 ')
    .replace(/satu sembilan empat lima/gi, ' 1945 ')

  // 2. Remove common ceremony preamble / doctrine titles recited before the text
  cleaned = cleaned
    .replace(/demi allah saya bersumpah/gi, ' ')
    .replace(/demi allah saya berjanji/gi, ' ')
    .replace(/bahwa saya akan/gi, ' ')
    .replace(/bahwa saya/gi, ' ')
    .replace(/sumpah prajurit/gi, ' ')
    .replace(/sapta marga/gi, ' ')
    .replace(/delapan wajib tni/gi, ' ')
    .replace(/8 wajib tni/gi, ' ')
    .replace(/wajib tni/gi, ' ')

  // 3. Remove standalone recited numbers and bullet markers (e.g. "satu", "dua", "butir 1", "nomor 1")
  cleaned = cleaned
    .replace(/\b(butir|nomor|ke)\s*\d+\b/gi, ' ')
    .replace(/\b(butir|nomor)\s*(satu|dua|tiga|empat|lima|enam|tujuh|delapan)\b/gi, ' ')
    .replace(/\b(satu|dua|tiga|empat|lima|enam|tujuh|delapan|pertama|kedua|ketiga|keempat|kelima|keenam|ketujuh|kedelapan)\b/gi, ' ')
    .replace(/\b[1-8]\b/g, ' ')

  // 4. Remove punctuation & special characters (convert hyphens to space so sekeras-kerasnya becomes sekeras kerasnya)
  cleaned = cleaned
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"\[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return cleaned
}

export function normalizeText(text: string): string {
  return normalizeRecitationText(text)
}

export function tokenizeText(text: string): string[] {
  return normalizeRecitationText(text)
    .split(' ')
    .filter((w) => w.length > 0)
}
