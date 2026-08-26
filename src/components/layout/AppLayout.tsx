import AppSidebar from './AppSidebar'
import MobileNavigation from './MobileNavigation'
import AppHeader from './AppHeader'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ background: 'var(--color-bg-primary)' }}>
      {/* Desktop Sidebar */}
      <AppSidebar />

      {/* Mobile Top Header */}
      <AppHeader />

      {/* Main Content Area */}
      <main
        className="relative z-content flex-1 pt-14 pb-20 lg:pt-0 lg:pb-0"
        style={{
          marginLeft: 0,
        }}
      >
        <style>{`
          @media (min-width: 1024px) {
            main {
              margin-left: 248px !important;
              padding-top: 0 !important;
              padding-bottom: 0 !important;
            }
          }
        `}</style>
        {children}

        {/* Universal Footer for Mobile & Desktop */}
        <footer
          className="mt-8 py-6 px-4 text-center border-t border-[var(--color-border)]"
          style={{ background: 'rgba(12,23,16,0.6)' }}
        >
          <div className="max-w-xl mx-auto space-y-1">
            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '0.03em' }}>
              <span style={{ color: 'var(--color-accent)' }}>SIAP</span> — Sistem Interaktif Asah Prajurit
            </p>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
              Latih. Hafalkan. Tepatkan.
            </p>
            <p style={{ fontSize: '0.64rem', color: 'var(--color-text-muted)', paddingTop: 2 }}>
              Platform Mandiri Hafalan Doktrin TNI (Sapta Marga · Sumpah Prajurit · 8 Wajib TNI)
            </p>
          </div>
        </footer>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation />
    </div>
  )
}
