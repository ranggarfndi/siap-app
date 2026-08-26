'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import type { Material, FlashcardRating } from '@/types'

interface FlashCardProps {
  material: Material
}

const RATINGS: { value: FlashcardRating; label: string; mobileLabel: string; color: string }[] = [
  { value: 'not-memorized', label: 'Belum Hafal', mobileLabel: 'Belum', color: 'var(--color-error)' },
  { value: 'almost', label: 'Hampir Hafal', mobileLabel: 'Hampir', color: 'var(--color-warning)' },
  { value: 'memorized', label: 'Sudah Hafal', mobileLabel: 'Hafal', color: 'var(--color-success)' },
]

export default function FlashCard({ material }: FlashCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [ratings, setRatings] = useState<Record<string, FlashcardRating>>({})

  const item = material.items[currentIndex]
  const total = material.items.length

  function handleRating(rating: FlashcardRating) {
    setRatings((prev) => ({ ...prev, [item.id]: rating }))
    // Auto advance
    setTimeout(() => {
      if (currentIndex < total - 1) {
        setCurrentIndex(currentIndex + 1)
        setIsFlipped(false)
      }
    }, 300)
  }

  const memorizedCount = Object.values(ratings).filter((r) => r === 'memorized').length
  const almostCount = Object.values(ratings).filter((r) => r === 'almost').length

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* Stats Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex gap-2">
          {Object.keys(ratings).length > 0 ? (
            <>
              <span className="badge" style={{ background: 'rgba(118,196,66,0.12)', color: 'var(--color-success)', border: '1px solid rgba(118,196,66,0.3)' }}>
                ✓ {memorizedCount} Hafal
              </span>
              <span className="badge" style={{ background: 'rgba(227,179,65,0.12)', color: 'var(--color-warning)', border: '1px solid rgba(227,179,65,0.3)' }}>
                ~ {almostCount} Hampir
              </span>
            </>
          ) : (
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Ketuk kartu untuk membalik
            </span>
          )}
        </div>
        <span className="badge" style={{ background: 'rgba(123,190,69,0.08)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
          {currentIndex + 1} / {total}
        </span>
      </div>

      {/* 3D Flip Card */}
      <div
        style={{ perspective: '1000px', minHeight: 220 }}
        onClick={() => setIsFlipped(!isFlipped)}
        className="cursor-pointer active:scale-[0.99] transition-transform"
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            minHeight: 220,
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.45s ease',
          }}
        >
          {/* Front */}
          <div
            className="card"
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              padding: 'clamp(1.5rem, 5vw, 2.5rem)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <p className="section-label mb-2">{material.name.toUpperCase()}</p>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 8vw, 3.5rem)',
                fontWeight: 900,
                color: 'var(--color-accent)',
                lineHeight: 1,
              }}
            >
              BUTIR {item.number}
            </p>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>
              💡 Ketuk kartu untuk lihat isi butir
            </p>
          </div>

          {/* Back */}
          <div
            className="card"
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              padding: 'clamp(1.25rem, 4vw, 2rem)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              background: 'var(--color-bg-elevated)',
              borderColor: 'var(--color-border-accent)',
            }}
          >
            <p className="section-label mb-2">BUTIR {item.number}</p>
            <p
              style={{
                fontSize: 'clamp(0.92rem, 3vw, 1.08rem)',
                lineHeight: 1.75,
                color: 'var(--color-text-primary)',
              }}
            >
              {item.text}
            </p>
          </div>
        </div>
      </div>

      {/* Rating buttons (Revealed when flipped) */}
      {isFlipped && (
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {RATINGS.map(({ value, label, mobileLabel, color }) => (
            <button
              key={value}
              onClick={(e) => {
                e.stopPropagation()
                handleRating(value)
              }}
              style={{
                padding: '0.625rem 0.25rem',
                minHeight: 44,
                background: `${color}18`,
                border: `1px solid ${color}45`,
                borderRadius: 8,
                color,
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              className="active:scale-[0.97]"
            >
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{mobileLabel}</span>
            </button>
          ))}
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          onClick={() => {
            setCurrentIndex(Math.max(0, currentIndex - 1))
            setIsFlipped(false)
          }}
          disabled={currentIndex === 0}
          className="btn-ghost flex items-center gap-1 text-xs sm:text-sm py-2 px-3"
          style={{ opacity: currentIndex === 0 ? 0.35 : 1 }}
        >
          <ChevronLeft size={15} />
          <span>Sebelumnya</span>
        </button>

        <button
          onClick={() => {
            setCurrentIndex(0)
            setIsFlipped(false)
            setRatings({})
          }}
          className="btn-ghost flex items-center gap-1 text-xs sm:text-sm py-2 px-2.5"
          title="Ulangi dari awal"
        >
          <RotateCcw size={13} />
          <span className="hidden xs:inline">Ulangi</span>
        </button>

        <button
          onClick={() => {
            setCurrentIndex(Math.min(total - 1, currentIndex + 1))
            setIsFlipped(false)
          }}
          disabled={currentIndex === total - 1}
          className="btn-primary flex items-center gap-1 text-xs sm:text-sm py-2 px-3"
          style={{ opacity: currentIndex === total - 1 ? 0.35 : 1 }}
        >
          <span>Berikutnya</span>
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}
