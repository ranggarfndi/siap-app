'use client'

import Image from 'next/image'
import ProgressRing from '@/components/ui/ProgressRing'
import type { Progress } from '@/types'

interface HeroSectionProps {
  totalProgress: number
  activeMaterials: number
  totalMaterials: number
  totalSubmissions: number
  progressList: Progress[]
}

export default function HeroSection({
  totalProgress,
  activeMaterials,
  totalMaterials,
  totalSubmissions,
  progressList,
}: HeroSectionProps) {
  const avgScore =
    progressList.length > 0
      ? Math.round(progressList.reduce((acc, p) => acc + p.averageScore, 0) / progressList.length)
      : 0

  return (
    <div
      className="card relative overflow-hidden"
      style={{
        padding: 'clamp(1rem, 3.5vw, 1.75rem)',
        background: 'linear-gradient(135deg, var(--color-bg-card) 0%, rgba(72,91,44,0.18) 100%)',
        borderColor: 'var(--color-border-accent)',
      }}
    >
      {/* Decorative bg light */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 w-40 h-40 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(123,190,69,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Top Header Row: Branding with Logo + Progress Ring */}
      <div className="flex items-start justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div
            className="relative rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center mt-1"
            style={{
              width: 54,
              height: 54,
              background: '#07110C',
              border: '1.5px solid rgba(123,190,69,0.4)',
              boxShadow: '0 0 20px rgba(123,190,69,0.2)',
            }}
          >
            <Image
              src="/siap-logo.png"
              alt="Logo SIAP"
              width={52}
              height={52}
              className="object-cover"
              priority
            />
          </div>

          <div>
            <p className="section-label mb-0.5">SISTEM INTERAKTIF ASAH PRAJURIT</p>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 5vw, 2.25rem)',
                fontWeight: 800,
                letterSpacing: '0.06em',
                color: 'var(--color-accent)',
                lineHeight: 1.1,
              }}
            >
              SIAP
            </h1>
            <p
              style={{
                fontSize: '0.78rem',
                color: 'var(--color-text-secondary)',
                fontStyle: 'italic',
                marginTop: '0.15rem',
              }}
            >
              Latih. Hafalkan. Tepatkan.
            </p>
          </div>
        </div>

        {/* Ring */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="sm:hidden">
            <ProgressRing
              percent={totalProgress}
              size={68}
              strokeWidth={5.5}
              label={`${totalProgress}%`}
            />
          </div>
          <div className="hidden sm:block">
            <ProgressRing
              percent={totalProgress}
              size={90}
              strokeWidth={7}
              label={`${totalProgress}%`}
              sublabel="Progress"
            />
          </div>
          <span style={{ fontSize: '0.62rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
            Total Hafalan
          </span>
        </div>
      </div>

      {/* Stats 3-column Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div
          className="rounded-lg p-2 sm:p-3 text-center sm:text-left"
          style={{ background: 'rgba(7,17,12,0.4)', border: '1px solid var(--color-border)' }}
        >
          <p className="section-label mb-0.5 text-[0.6rem] sm:text-[0.68rem]">MATERI</p>
          <p
            style={{
              fontSize: 'clamp(1.15rem, 3.5vw, 1.4rem)',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text-primary)',
              lineHeight: 1.1,
            }}
          >
            {activeMaterials}
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginLeft: 2 }}>
              /{totalMaterials}
            </span>
          </p>
        </div>

        <div
          className="rounded-lg p-2 sm:p-3 text-center sm:text-left"
          style={{ background: 'rgba(7,17,12,0.4)', border: '1px solid var(--color-border)' }}
        >
          <p className="section-label mb-0.5 text-[0.6rem] sm:text-[0.68rem]">SETORAN</p>
          <p
            style={{
              fontSize: 'clamp(1.15rem, 3.5vw, 1.4rem)',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text-primary)',
              lineHeight: 1.1,
            }}
          >
            {totalSubmissions}
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginLeft: 2 }}>
              x
            </span>
          </p>
        </div>

        <div
          className="rounded-lg p-2 sm:p-3 text-center sm:text-left"
          style={{ background: 'rgba(7,17,12,0.4)', border: '1px solid var(--color-border)' }}
        >
          <p className="section-label mb-0.5 text-[0.6rem] sm:text-[0.68rem]">RATA-RATA</p>
          <p
            style={{
              fontSize: 'clamp(1.15rem, 3.5vw, 1.4rem)',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              color:
                avgScore >= 85
                  ? 'var(--color-accent)'
                  : avgScore >= 70
                  ? 'var(--color-warning)'
                  : 'var(--color-text-primary)',
              lineHeight: 1.1,
            }}
          >
            {avgScore > 0 ? `${avgScore}%` : '—'}
          </p>
        </div>
      </div>
    </div>
  )
}
