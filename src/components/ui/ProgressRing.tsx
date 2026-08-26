'use client'

interface ProgressRingProps {
  percent: number
  size?: number
  strokeWidth?: number
  color?: string
  trackColor?: string
  label?: string
  sublabel?: string
}

export default function ProgressRing({
  percent,
  size = 80,
  strokeWidth = 7,
  color = 'var(--color-accent)',
  trackColor = 'var(--color-border)',
  label,
  sublabel,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
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
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>

      {/* Center label */}
      {label !== undefined && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center"
          style={{ transform: 'rotate(0deg)' }}
        >
          <span
            style={{
              fontSize: size > 70 ? '1rem' : '0.75rem',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              lineHeight: 1.1,
            }}
          >
            {label}
          </span>
          {sublabel && (
            <span style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', marginTop: 1 }}>
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
