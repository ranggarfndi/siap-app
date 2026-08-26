'use client'

import { useState, useMemo } from 'react'
import type { Material } from '@/types'
import Link from 'next/link'

interface HiddenWordsExerciseProps {
  material: Material
}

type Difficulty = 'mudah' | 'sedang' | 'sulit'

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; hiddenRatio: number; color: string }> = {
  mudah: { label: 'Mudah (20%)', hiddenRatio: 0.2, color: 'var(--color-success)' },
  sedang: { label: 'Sedang (40%)', hiddenRatio: 0.4, color: 'var(--color-warning)' },
  sulit: { label: 'Sulit (65%)', hiddenRatio: 0.65, color: 'var(--color-error)' },
}

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function getHiddenIndices(words: string[], ratio: number, seed: number): Set<number> {
  const rand = seededRandom(seed)
  const count = Math.ceil(words.length * ratio)
  const indices = Array.from({ length: words.length }, (_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]]
  }
  return new Set(indices.slice(0, count))
}

export default function HiddenWordsExercise({ material }: HiddenWordsExerciseProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('mudah')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealed, setRevealed] = useState<Set<number>>(new Set())

  const item = material.items[currentIndex]
  const config = DIFFICULTY_CONFIG[difficulty]

  const words = useMemo(() => item.text.split(/\s+/), [item.text])
  const hiddenIndices = useMemo(
    () => getHiddenIndices(words, config.hiddenRatio, item.id.charCodeAt(0) + difficulty.charCodeAt(0)),
    [words, config.hiddenRatio, item.id, difficulty]
  )

  function handleRevealWord(idx: number) {
    setRevealed((prev) => new Set([...prev, idx]))
  }

  function reset() {
    setRevealed(new Set())
  }

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* Difficulty selector */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => {
                setDifficulty(d)
                reset()
              }}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: 6,
                background: difficulty === d ? `${DIFFICULTY_CONFIG[d].color}20` : 'transparent',
                border: `1px solid ${difficulty === d ? DIFFICULTY_CONFIG[d].color + '70' : 'var(--color-border)'}`,
                color: difficulty === d ? DIFFICULTY_CONFIG[d].color : 'var(--color-text-muted)',
                fontSize: '0.75rem',
                fontWeight: difficulty === d ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              {DIFFICULTY_CONFIG[d].label}
            </button>
          ))}
        </div>

        <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>
          {Math.ceil(words.length * config.hiddenRatio)} kata rumpang
        </span>
      </div>

      {/* Butir navigation buttons */}
      <div className="flex gap-1.5 flex-wrap items-center">
        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginRight: 4 }}>
          Butir:
        </span>
        {material.items.map((it, i) => (
          <button
            key={it.id}
            onClick={() => {
              setCurrentIndex(i)
              reset()
            }}
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: i === currentIndex ? 'var(--color-accent)' : 'var(--color-bg-card)',
              border: `1px solid ${i === currentIndex ? 'var(--color-accent)' : 'var(--color-border)'}`,
              color: i === currentIndex ? '#07110C' : 'var(--color-text-secondary)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {it.number}
          </button>
        ))}
      </div>

      {/* Text with interactive hidden words */}
      <div
        className="card"
        style={{
          padding: 'clamp(1.1rem, 4vw, 1.75rem)',
          lineHeight: 2.1,
          fontSize: 'clamp(0.92rem, 3vw, 1.05rem)',
        }}
      >
        <p className="section-label mb-3">BUTIR {item.number} — KETUK KOTAK UNTUK MEMBUKA KATA</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 6px' }}>
          {words.map((word, idx) => {
            const isHidden = hiddenIndices.has(idx) && !revealed.has(idx)
            return isHidden ? (
              <button
                key={idx}
                onClick={() => handleRevealWord(idx)}
                title="Ketuk untuk membuka"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(123,190,69,0.12)',
                  border: '1px solid rgba(123,190,69,0.35)',
                  borderRadius: 6,
                  padding: '2px 8px',
                  minWidth: Math.max(44, word.length * 8),
                  height: '1.85em',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  color: 'transparent',
                  userSelect: 'none',
                }}
                className="active:scale-95"
              >
                ?
              </button>
            ) : (
              <span
                key={idx}
                style={{
                  color:
                    revealed.has(idx) && hiddenIndices.has(idx)
                      ? 'var(--color-accent)'
                      : 'var(--color-text-primary)',
                  fontWeight: revealed.has(idx) && hiddenIndices.has(idx) ? 600 : 400,
                }}
              >
                {word}
              </span>
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2.5 pt-1">
        <div className="flex gap-2">
          <button onClick={reset} className="btn-ghost flex-1 xs:flex-none text-xs py-2 px-3">
            Sembunyikan
          </button>
          <button
            onClick={() => setRevealed(new Set(Array.from(hiddenIndices)))}
            className="btn-ghost flex-1 xs:flex-none text-xs py-2 px-3"
          >
            Buka Semua
          </button>
        </div>

        <Link
          href={`/setor/${material.id}`}
          className="btn-primary text-center justify-center text-xs py-2 px-4"
        >
          Mulai Setoran →
        </Link>
      </div>
    </div>
  )
}
