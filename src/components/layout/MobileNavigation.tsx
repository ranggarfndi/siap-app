'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, Mic2, BarChart3, History } from 'lucide-react'

const mobileNavItems = [
  { href: '/', label: 'Beranda', icon: LayoutDashboard },
  { href: '/latihan', label: 'Latihan', icon: BookOpen },
  { href: '/setor', label: 'Setor', icon: Mic2 },
  { href: '/progress', label: 'Progress', icon: BarChart3 },
  { href: '/riwayat', label: 'Riwayat', icon: History },
]

export default function MobileNavigation() {
  const pathname = usePathname()

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(12, 23, 16, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--color-border)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 2px)',
      }}
    >
      <div className="flex items-center justify-around px-1 py-1">
        {mobileNavItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center py-1.5 px-1 min-w-0 flex-1 transition-all rounded-lg"
              style={{
                color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
              }}
            >
              <div
                className="flex items-center justify-center rounded-lg transition-all"
                style={{
                  width: 32,
                  height: 28,
                  background: isActive ? 'rgba(123,190,69,0.18)' : 'transparent',
                }}
              >
                <Icon size={18} />
              </div>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: '0.02em',
                  marginTop: 2,
                  lineHeight: 1,
                }}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
