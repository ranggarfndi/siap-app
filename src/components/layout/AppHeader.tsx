'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trophy, Settings } from 'lucide-react'
import { getXP } from '@/lib/gamification/xp'

export default function AppHeader() {
  const [xp, setXp] = useState(0)

  useEffect(() => {
    setXp(getXP())
    const handleStorage = () => setXp(getXP())
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return (
    <header
      className="lg:hidden fixed top-0 left-0 right-0 z-40 px-3 py-2.5 flex items-center justify-between"
      style={{
        background: 'rgba(12, 23, 16, 0.92)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      {/* Brand logo & Full Name */}
      <Link href="/" className="flex items-center gap-2.5 min-w-0 pr-2">
        <div
          className="relative rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
          style={{
            width: 36,
            height: 36,
            background: '#07110C',
            border: '1.2px solid rgba(123, 190, 69, 0.4)',
            boxShadow: '0 0 10px rgba(123,190,69,0.15)',
          }}
        >
          <Image
            src="/siap-logo.png"
            alt="Logo SIAP"
            width={34}
            height={34}
            className="object-cover"
            priority
          />
        </div>
        <div className="min-w-0">
          <p
            className="font-display font-bold leading-none"
            style={{ fontSize: '1.1rem', letterSpacing: '0.08em', color: 'var(--color-accent)' }}
          >
            SIAP
          </p>
          <p
            style={{
              fontSize: '0.58rem',
              color: 'var(--color-text-secondary)',
              letterSpacing: '0.01em',
              fontWeight: 600,
              marginTop: 2,
              lineHeight: 1.15,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Sistem Interaktif Asah Prajurit
          </p>
        </div>
      </Link>

      {/* Right controls: XP Badge, Pencapaian, Pengaturan */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <Link
          href="/pencapaian"
          className="flex items-center gap-1 px-2 py-1 rounded-full transition-colors"
          style={{
            background: 'rgba(201, 163, 61, 0.12)',
            border: '1px solid rgba(201, 163, 61, 0.25)',
          }}
        >
          <span style={{ fontSize: '0.65rem' }}>⭐</span>
          <span
            suppressHydrationWarning
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              color: 'var(--color-gold)',
              fontFamily: 'var(--font-display)',
            }}
          >
            {xp} XP
          </span>
        </Link>

        <Link
          href="/pencapaian"
          aria-label="Pencapaian"
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
          style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-secondary)',
          }}
        >
          <Trophy size={14} />
        </Link>

        <Link
          href="/pengaturan"
          aria-label="Pengaturan"
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
          style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-secondary)',
          }}
        >
          <Settings size={14} />
        </Link>
      </div>
    </header>
  )
}
