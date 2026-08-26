'use client'

interface AudioWaveformProps {
  isRecording: boolean
  barCount?: number
}

export default function AudioWaveform({ isRecording, barCount = 24 }: AudioWaveformProps) {
  return (
    <div
      className="flex items-end justify-center gap-1"
      style={{ height: 48 }}
      aria-hidden="true"
    >
      {Array.from({ length: barCount }, (_, i) => {
        const delay = (i / barCount) * 0.8
        const height = isRecording
          ? `${Math.random() * 60 + 20}%`
          : '15%'

        return (
          <div
            key={i}
            style={{
              width: 3,
              height: isRecording ? undefined : '15%',
              minHeight: 4,
              maxHeight: '100%',
              background: isRecording ? 'var(--color-accent)' : 'var(--color-border)',
              borderRadius: 2,
              animation: isRecording ? `waveform 0.6s ease-in-out ${delay}s infinite alternate` : 'none',
              transition: 'background 0.3s',
              flex: '0 0 auto',
            }}
          />
        )
      })}

      <style>{`
        @keyframes waveform {
          0% { transform: scaleY(0.2); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  )
}
