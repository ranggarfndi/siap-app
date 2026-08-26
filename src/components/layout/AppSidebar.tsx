'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  Mic2,
  History,
  BarChart3,
  Trophy,
  Settings,
  Sparkles,
} from 'lucide-react'

const navItems = [
  { href: '/', label: 'Beranda', icon: LayoutDashboard },
  { href: '/latihan', label: 'Latihan', icon: BookOpen },
  { href: '/setor', label: 'Setor Hafalan', icon: Mic2 },
  { href: '/kartu', label: 'Kartu Doktrin', icon: Sparkles },
  { href: '/riwayat', label: 'Riwayat', icon: History },
  { href: '/progress', label: 'Nilai & Progress', icon: BarChart3 },
  { href: '/pencapaian', label: 'Pencapaian', icon: Trophy },
  { href: '/pengaturan', label: 'Pengaturan', icon: Settings },
]

export default function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="hidden lg:flex flex-col fixed left-0 top-0 h-screen z-40"
      style={{
        width: '248px',
        background: 'var(--color-bg-secondary)',
        borderRight: '1px solid var(--color-border)',
      }}
    >
      {/* Logo Brand Header with Full Expansion */}
      <Link
        href="/"
        className="flex items-center gap-3 px-4 py-4 transition-colors hover:bg-[var(--color-bg-card)]"
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        <div
          className="relative rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
          style={{
            width: 44,
            height: 44,
            background: '#07110C',
            border: '1.5px solid rgba(123,190,69,0.35)',
            boxShadow: '0 0 16px rgba(123,190,69,0.15)',
          }}
        >
          <Image
            src="/siap-logo.png"
            alt="Logo SIAP"
            width={42}
            height={42}
            className="object-cover"
            priority
          />
        </div>
        <div className="min-w-0">
          <p
            className="font-display font-bold leading-none"
            style={{ fontSize: '1.25rem', letterSpacing: '0.08em', color: 'var(--color-accent)' }}
          >
            SIAP
          </p>
          <p
            style={{
              fontSize: '0.65rem',
              color: 'var(--color-text-secondary)',
              letterSpacing: '0.01em',
              fontWeight: 600,
              marginTop: 3,
              lineHeight: 1.25,
            }}
          >
            Sistem Interaktif Asah Prajurit
          </p>
        </div>
      </Link>

      {/* Navigation items */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="section-label px-3 mb-3">NAVIGASI UTAMA</p>
        <ul className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200"
                  style={{
                    background: isActive ? 'rgba(123,190,69,0.12)' : 'transparent',
                    color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    border: isActive
                      ? '1px solid rgba(123,190,69,0.25)'
                      : '1px solid transparent',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 700 : 400,
                  }}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Sidebar Footer with Full Name */}
      <div
        className="px-4 py-3.5 space-y-1"
        style={{
          borderTop: '1px solid var(--color-border)',
          background: 'rgba(7,17,12,0.4)',
        }}
      >
        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
          <span style={{ color: 'var(--color-accent)' }}>SIAP</span>
        </p>
        <p style={{ fontSize: '0.62rem', color: 'var(--color-text-muted)', lineHeight: 1.3 }}>
          Sistem Interaktif Asah Prajurit · Doktrin TNI
        </p>
        <div className="flex items-center gap-1.5 pt-1" style={{ fontSize: '0.62rem', color: 'var(--color-text-muted)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
          <span>Tersimpan lokal · Offline-Ready</span>
        </div>
      </div>
    </aside>
  )
}
