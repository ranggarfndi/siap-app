'use client'

import type { WordComparison } from '@/types'

interface WordDiffProps {
  referenceWords: WordComparison[]
  userWords: WordComparison[]
  showLegend?: boolean
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  correct: { bg: 'rgba(118,196,66,0.18)', color: 'var(--color-word-correct)', label: 'Tepat / Benar' },
  incorrect: { bg: 'rgba(227,179,65,0.18)', color: 'var(--color-word-incorrect)', label: 'Kurang Tepat' },
  missing: { bg: 'rgba(217,83,79,0.18)', color: 'var(--color-word-missing)', label: 'Terlewat' },
  extra: { bg: 'rgba(122,138,120,0.18)', color: 'var(--color-word-extra)', label: 'Kata Tambahan' },
}

function WordChip({ word, status, title }: { word: string; status: string; title?: string }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.correct
  return (
    <span
      title={title}
      style={{
        display: 'inline-block',
        padding: '2px 7px',
        borderRadius: 5,
        background: style.bg,
        color: style.color,
        fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
        fontWeight: status !== 'correct' ? 700 : 400,
        margin: '2px 2px',
        lineHeight: 1.6,
        textDecoration: status === 'missing' ? 'line-through' : 'none',
        opacity: status === 'extra' ? 0.75 : 1,
      }}
    >
      {word}
    </span>
  )
}

export default function WordDiff({ referenceWords, userWords, showLegend = true }: WordDiffProps) {
  return (
    <div className="space-y-4">
      {/* Legend */}
      {showLegend && (
        <div className="card p-3 flex flex-wrap gap-2.5 sm:gap-4 items-center">
          {Object.entries(STATUS_STYLES).map(([status, { color, label }]) => (
            <div key={status} className="flex items-center gap-1.5">
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  background: color,
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Annotated Reference Text */}
      <div>
        <p className="section-label mb-2">TEKS DOKTRIN RESMI (Anotasi Koreksi)</p>
        <div
          className="card"
          style={{
            padding: 'clamp(0.875rem, 3.5vw, 1.25rem)',
            lineHeight: 2,
            wordBreak: 'break-word',
          }}
        >
          {referenceWords.map((w, i) => (
            <WordChip
              key={i}
              word={w.word}
              status={w.status}
              title={
                w.status === 'incorrect' && w.referenceWord
                  ? `Kamu berucap: "${w.referenceWord}"`
                  : undefined
              }
            />
          ))}
        </div>
      </div>

      {/* Annotated User Words */}
      <div>
        <p className="section-label mb-2">TEKS HAFALANMU</p>
        <div
          className="card"
          style={{
            padding: 'clamp(0.875rem, 3.5vw, 1.25rem)',
            lineHeight: 2,
            wordBreak: 'break-word',
          }}
        >
          {userWords.length > 0 ? (
            userWords.map((w, i) => (
              <WordChip
                key={i}
                word={w.word}
                status={w.status}
                title={
                  w.status === 'incorrect' && w.referenceWord
                    ? `Seharusnya: "${w.referenceWord}"`
                    : undefined
                }
              />
            ))
          ) : (
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              Tidak ada masukan hafalan yang terdeteksi
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
