'use client'

import { CheckCircle2, Circle } from 'lucide-react'
import type { Activity, Material } from '@/types'

interface DailyTargetProps {
  target: number
  todayActivity: Activity | undefined
  materials: Material[]
  submittedMaterialIds: string[]
}

export default function DailyTarget({
  target,
  todayActivity,
  materials,
  submittedMaterialIds,
}: DailyTargetProps) {
  const done = todayActivity?.submissionCount ?? 0
  const percent = Math.min(100, Math.round((done / target) * 100))

  return (
    <div className="card p-3.5 sm:p-5">
      <div className="flex justify-between items-center mb-3">
        <div>
          <p className="section-label mb-0.5">TARGET HARIAN</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            {done} / {target} Setoran
          </p>
        </div>
        <span
          className="badge"
          style={
            done >= target
              ? { background: 'rgba(118,196,66,0.15)', color: 'var(--color-success)', border: '1px solid rgba(118,196,66,0.3)' }
              : { background: 'rgba(201,163,61,0.12)', color: 'var(--color-gold)', border: '1px solid rgba(201,163,61,0.25)' }
          }
        >
          {done >= target ? '✓ Selesai' : `${percent}%`}
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 6,
          background: 'var(--color-border)',
          borderRadius: 999,
          overflow: 'hidden',
          marginBottom: '0.875rem',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percent}%`,
            background: done >= target ? 'var(--color-success)' : 'var(--color-gold)',
            borderRadius: 999,
            transition: 'width 0.6s ease',
          }}
        />
      </div>

      {/* Materials checklist */}
      <ul className="space-y-1.5 pt-1">
        {materials.map((m) => {
          const isDone = submittedMaterialIds.includes(m.id)
          return (
            <li key={m.id} className="flex items-center gap-2">
              {isDone ? (
                <CheckCircle2 size={15} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
              ) : (
                <Circle size={15} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
              )}
              <span
                style={{
                  fontSize: '0.78rem',
                  color: isDone ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                  fontWeight: isDone ? 600 : 400,
                }}
              >
                {m.name}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
