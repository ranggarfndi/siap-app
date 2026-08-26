'use client'

import { useEffect, useState } from 'react'
import { getScoreCategory } from '@/lib/scoring/score'

interface ScoreCircleProps {
  score: number
  size?: number
  animated?: boolean
}

const CATEGORY_COLORS: Record<string, string> = {
  'sangat-baik': '#76C442',
  baik: '#7BBE45',
  cukup: '#E3B341',
  'perlu-latihan': '#E07B39',
  'perlu-mengulang': '#D9534F',
}

const CATEGORY_LABELS: Record<string, string> = {
  'sangat-baik': 'Sangat Baik',
  baik: 'Baik',
  cukup: 'Cukup',
  'perlu-latihan': 'Perlu Latihan',
  'perlu-mengulang': 'Perlu Mengulang',
}

export default function ScoreCircle({ score, size = 120, animated = true }: ScoreCircleProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score)
  const category = getScoreCategory(score)
  const color = CATEGORY_COLORS[category]
  const label = CATEGORY_LABELS[category]

  const strokeWidth = size * 0.07
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (displayScore / 100) * circumference

  useEffect(() => {
    if (!animated) return
    let frame: number
    const start = performance.now()
    const duration = 1200

    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayScore(Math.round(eased * score))
      if (progress < 1) frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [score, animated])

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(-90deg)' }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: animated ? 'none' : 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            style={{
              fontSize: size * 0.22,
              fontWeight: 800,
              color: 'var(--color-text-primary)',
              lineHeight: 1,
              fontFamily: 'var(--font-display)',
            }}
          >
            {displayScore}
          </span>
          <span style={{ fontSize: size * 0.1, color: 'var(--color-text-muted)', marginTop: 2 }}>
            AKURASI
          </span>
        </div>
      </div>
      <span
        className="badge"
        style={{
          background: `${color}22`,
          color,
          border: `1px solid ${color}44`,
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </span>
    </div>
  )
}
