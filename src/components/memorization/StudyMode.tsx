'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react'
import type { Material } from '@/types'
import Link from 'next/link'

interface StudyModeProps {
  material: Material
}

export default function StudyMode({ material }: StudyModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showText, setShowText] = useState(true)

  const item = material.items[currentIndex]
  const total = material.items.length
  const progress = Math.round(((currentIndex + 1) / total) * 100)

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* Progress bar */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Butir {currentIndex + 1} dari {total}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 700 }}>
            {progress}%
          </span>
        </div>
        <div style={{ height: 4, background: 'var(--color-border)', borderRadius: 999 }}>
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'var(--color-accent)',
              borderRadius: 999,
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* Main Study Card */}
      <div
        className="card relative overflow-hidden flex flex-col justify-between"
        style={{
          padding: 'clamp(1.2rem, 4vw, 2rem)',
          minHeight: 200,
        }}
      >
        {/* Decorative number */}
        <div
          className="pointer-events-none absolute top-1 right-4 select-none font-display font-black"
          style={{
            fontSize: 'clamp(3.5rem, 10vw, 5rem)',
            color: 'rgba(123,190,69,0.06)',
            lineHeight: 1,
          }}
        >
          {item.number}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="badge badge-accent text-[0.68rem]">
              BUTIR {item.number}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              {material.name}
            </span>
          </div>

          {showText ? (
            <p
              style={{
                fontSize: 'clamp(0.95rem, 3vw, 1.12rem)',
                lineHeight: 1.8,
                color: 'var(--color-text-primary)',
              }}
            >
              {item.text}
            </p>
          ) : (
            <div
              style={{
                background: 'rgba(123,190,69,0.04)',
                border: '1px dashed var(--color-border-accent)',
                borderRadius: 10,
                padding: '1.5rem 1rem',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
                fontSize: '0.85rem',
              }}
            >
              🔒 Teks disembunyikan. Coba ucapkan / ingat hafalanmu!
            </div>
          )}
        </div>

        {/* Toggle show/hide */}
        <div className="pt-4 mt-2">
          <button
            onClick={() => setShowText(!showText)}
            className="btn-ghost flex items-center gap-2 text-xs py-2 px-3.5"
          >
            {showText ? <EyeOff size={14} /> : <Eye size={14} />}
            {showText ? 'Sembunyikan Teks' : 'Tampilkan Teks'}
          </button>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="btn-ghost flex items-center gap-1.5 text-xs sm:text-sm py-2 px-3 sm:px-4"
          style={{ opacity: currentIndex === 0 ? 0.35 : 1 }}
        >
          <ChevronLeft size={16} />
          <span className="hidden xs:inline">Sebelumnya</span>
        </button>

        {/* Indicator dots */}
        <div className="flex gap-1.5 items-center px-1 overflow-x-auto max-w-[150px] sm:max-w-none">
          {material.items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Butir ${i + 1}`}
              style={{
                width: i === currentIndex ? 18 : 7,
                height: 7,
                borderRadius: 999,
                background: i === currentIndex ? 'var(--color-accent)' : 'var(--color-border)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                padding: 0,
                flexShrink: 0,
              }}
            />
          ))}
        </div>

        {currentIndex === total - 1 ? (
          <Link
            href={`/setor/${material.id}`}
            className="btn-primary flex items-center gap-1.5 text-xs sm:text-sm py-2 px-3 sm:px-4"
          >
            Mulai Setor →
          </Link>
        ) : (
          <button
            onClick={() => setCurrentIndex(Math.min(total - 1, currentIndex + 1))}
            className="btn-primary flex items-center gap-1.5 text-xs sm:text-sm py-2 px-3 sm:px-4"
          >
            <span className="hidden xs:inline">Berikutnya</span>
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
