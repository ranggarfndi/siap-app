import AppLayout from '@/components/layout/AppLayout'
import Link from 'next/link'
import { materials } from '@/data/materials'
import { Shield, ScrollText, ListChecks, ArrowRight, Mic2, Keyboard } from 'lucide-react'

const ICONS: Record<string, React.ElementType> = {
  'sapta-marga': Shield,
  'sumpah-prajurit': ScrollText,
  '8-wajib-tni': ListChecks,
}

export default function SetorPage() {
  return (
    <AppLayout>
      <div className="page-container max-w-3xl space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <Mic2 size={18} style={{ color: 'var(--color-accent)' }} />
            <p className="section-label">SETOR HAFALAN</p>
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
            PILIH MATERI SETORAN
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Setorkan hafalan melalui ucapan suara atau ketikan teks untuk dinilai langsung.
          </p>
        </div>

        {/* Methods Info Banner */}
        <div
          className="card p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4"
          style={{ background: 'rgba(12,23,16,0.5)', borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(123,190,69,0.15)', color: 'var(--color-accent)' }}
            >
              <Mic2 size={15} />
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
              <strong style={{ color: 'var(--color-text-primary)' }}>Setor Suara</strong>: Ucapkan langsung di microphone
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(201,163,61,0.15)', color: 'var(--color-gold)' }}
            >
              <Keyboard size={15} />
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
              <strong style={{ color: 'var(--color-text-primary)' }}>Setor Ketikan</strong>: Ketik hafalan tanpa melihat teks
            </p>
          </div>
        </div>

        {/* Material List */}
        <div className="space-y-3 sm:space-y-4">
          {materials.map((material) => {
            const Icon = ICONS[material.id] ?? Shield
            return (
              <Link
                key={material.id}
                href={`/setor/${material.id}`}
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
                    }}
                  >
                    {material.description}
                  </p>
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
