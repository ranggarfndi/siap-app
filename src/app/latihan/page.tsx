import Link from 'next/link'
import AppLayout from '@/components/layout/AppLayout'
import { materials } from '@/data/materials'
import { Shield, ScrollText, ListChecks, ArrowRight, BookOpen } from 'lucide-react'

const ICONS: Record<string, React.ElementType> = {
  'sapta-marga': Shield,
  'sumpah-prajurit': ScrollText,
  '8-wajib-tni': ListChecks,
}

export default function LatihanPage() {
  return (
    <AppLayout>
      <div className="page-container max-w-3xl space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <BookOpen size={18} style={{ color: 'var(--color-accent)' }} />
            <p className="section-label">PUSAT LATIHAN</p>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.4rem, 4vw, 2rem)',
              fontWeight: 800,
              letterSpacing: '0.05em',
              color: 'var(--color-text-primary)',
            }}
          >
            PILIH MATERI HAFALAN
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Pilih doktrin yang ingin dipelajari melalui mode belajar, flashcard, atau kata rumpang.
          </p>
        </div>

        {/* Material list */}
        <div className="space-y-3 sm:space-y-4">
          {materials.map((material) => {
            const Icon = ICONS[material.id] ?? Shield
            return (
              <Link
                key={material.id}
                href={`/latihan/${material.id}`}
                className="card card-hover flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-5 group active:scale-[0.99] transition-all"
              >
                <div
                  className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `${material.color}22`,
                    border: `1px solid ${material.color}44`,
                  }}
                >
                  <Icon size={20} style={{ color: material.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {material.name.toUpperCase()}
                    </h2>
                    <span className="badge badge-accent text-[0.68rem] py-0.5 px-2">
                      {material.itemCount} Butir
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.4,
                      marginBottom: '0.4rem',
                    }}
                  >
                    {material.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span
                      className="badge"
                      style={{
                        background: 'rgba(123,190,69,0.08)',
                        color: 'var(--color-text-muted)',
                        border: '1px solid var(--color-border)',
                        fontSize: '0.68rem',
                      }}
                    >
                      Belajar · Flashcard · Rumpang
                    </span>
                  </div>
                </div>

                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
                >
                  <ArrowRight
                    size={14}
                    style={{ color: 'var(--color-text-muted)' }}
                    className="group-hover:translate-x-0.5 group-hover:text-accent transition-all"
                  />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
