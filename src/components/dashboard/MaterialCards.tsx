'use client'

import Link from 'next/link'
import { ArrowRight, Shield, ScrollText, ListChecks } from 'lucide-react'
import type { Progress, Material } from '@/types'

const MATERIAL_ICONS: Record<string, React.ElementType> = {
  'sapta-marga': Shield,
  'sumpah-prajurit': ScrollText,
  '8-wajib-tni': ListChecks,
}

interface MaterialCardsProps {
  materials: Material[]
  progressMap: Record<string, Progress | undefined>
}

export default function MaterialCards({ materials, progressMap }: MaterialCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {materials.map((material) => {
        const progress = progressMap[material.id]
        const percent = progress?.masteryPercent ?? 0
        const attempts = progress?.attemptCount ?? 0
        const bestScore = progress?.bestScore ?? 0
        const Icon = MATERIAL_ICONS[material.id] ?? Shield

        return (
          <Link
            key={material.id}
            href={`/latihan/${material.id}`}
            className="card card-hover block group active:scale-[0.99] transition-all"
            style={{ padding: 'clamp(1rem, 3.5vw, 1.25rem)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{
                    width: 36,
                    height: 36,
                    background: `${material.color}22`,
                    border: `1px solid ${material.color}44`,
                  }}
                >
                  <Icon size={18} style={{ color: material.color }} />
                </div>
                <div className="min-w-0">
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      color: 'var(--color-text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {material.name.toUpperCase()}
                  </h3>
                  <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                    {material.itemCount} butir hafalan
                  </p>
                </div>
              </div>

              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#1A2B1D] transition-colors"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              >
                <ArrowRight
                  size={13}
                  style={{ color: 'var(--color-text-muted)' }}
                  className="group-hover:translate-x-0.5 group-hover:text-accent transition-transform"
                />
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: '0.75rem' }}>
              <div className="flex justify-between items-center mb-1.5">
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Tingkat Penguasaan</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: material.color }}>
                  {percent}%
                </span>
              </div>
              <div
                style={{
                  height: 5,
                  background: 'var(--color-border)',
                  borderRadius: 999,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${percent}%`,
                    background: material.color,
                    borderRadius: 999,
                    transition: 'width 0.8s ease',
                  }}
                />
              </div>
            </div>

            {/* Bottom Stats */}
            <div
              className="grid grid-cols-2 gap-2 pt-2 text-center"
              style={{ borderTop: '1px solid rgba(30, 46, 32, 0.6)' }}
            >
              <div className="rounded p-1.5" style={{ background: 'rgba(7,17,12,0.3)' }}>
                <p style={{ fontSize: '0.62rem', color: 'var(--color-text-muted)' }}>Latihan</p>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {attempts}x
                </p>
              </div>
              <div className="rounded p-1.5" style={{ background: 'rgba(7,17,12,0.3)' }}>
                <p style={{ fontSize: '0.62rem', color: 'var(--color-text-muted)' }}>Skor Terbaik</p>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: material.color }}>
                  {attempts > 0 ? `${bestScore}%` : '—'}
                </p>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
