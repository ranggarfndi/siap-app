'use client'

interface StreakBadgeProps {
  streak: number
}

export default function StreakBadge({ streak }: StreakBadgeProps) {
  return (
    <div
      className="card flex items-center gap-3 p-3.5 sm:p-4"
      style={{ background: 'linear-gradient(135deg, var(--color-bg-card) 0%, rgba(201,163,61,0.06) 100%)' }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{
          background: 'rgba(201,163,61,0.12)',
          border: '1px solid rgba(201,163,61,0.25)',
          animation: streak > 0 ? 'recordPulse 2s ease-in-out infinite' : 'none',
        }}
      >
        🔥
      </div>
      <div>
        <p className="section-label mb-0.5">KONSISTENSI LATIHAN</p>
        <p className="flex items-baseline gap-1.5">
          <span
            style={{
              fontSize: '1.4rem',
              fontWeight: 900,
              fontFamily: 'var(--font-display)',
              color: streak >= 7 ? 'var(--color-gold)' : 'var(--color-text-primary)',
              lineHeight: 1,
            }}
          >
            {streak}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
            Hari berturut-turut
          </span>
        </p>
      </div>
    </div>
  )
}
