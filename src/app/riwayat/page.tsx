'use client'

import { useEffect, useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { getSubmissions } from '@/lib/storage/submissions'
import { getMaterialLabel } from '@/data/materials'
import { materials } from '@/data/materials'
import { History, Mic2, Keyboard } from 'lucide-react'
import type { Submission, MaterialId } from '@/types'

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

function getScoreColor(score: number): string {
  if (score >= 90) return 'var(--color-success)'
  if (score >= 70) return 'var(--color-warning)'
  return 'var(--color-error)'
}

export default function RiwayatPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [filter, setFilter] = useState<MaterialId | 'all'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getSubmissions(filter === 'all' ? undefined : filter)
      setSubmissions(data)
      setLoading(false)
    }
    load()
  }, [filter])

  return (
    <AppLayout>
      <div className="page-container max-w-3xl space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <History size={18} style={{ color: 'var(--color-accent)' }} />
            <p className="section-label">LOG AKTIVITAS</p>
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
            RIWAYAT SETORAN
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Daftar seluruh setoran hafalan yang telah dilakukan pada perangkat ini.
          </p>
        </div>

        {/* Filter Pills (Horizontal scroll on mobile) */}
        <div className="flex gap-2 overflow-x-auto pb-1.5 -mx-1 px-1">
          <button
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'badge badge-accent' : 'badge'}
            style={{
              cursor: 'pointer',
              border: filter === 'all' ? undefined : '1px solid var(--color-border)',
              color: filter === 'all' ? undefined : 'var(--color-text-muted)',
              background: filter === 'all' ? undefined : 'transparent',
              padding: '0.35rem 0.85rem',
              whiteSpace: 'nowrap',
            }}
          >
            Semua ({submissions.length})
          </button>
          {materials.map((m) => (
            <button
              key={m.id}
              onClick={() => setFilter(m.id)}
              className="badge"
              style={{
                cursor: 'pointer',
                background: filter === m.id ? `${m.color}22` : 'transparent',
                color: filter === m.id ? m.color : 'var(--color-text-muted)',
                border: `1px solid ${filter === m.id ? m.color + '55' : 'var(--color-border)'}`,
                padding: '0.35rem 0.85rem',
                whiteSpace: 'nowrap',
              }}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div
              style={{
                width: 32,
                height: 32,
                border: '2px solid var(--color-border)',
                borderTop: '2px solid var(--color-accent)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : submissions.length === 0 ? (
          <div className="card text-center p-8 sm:p-12">
            <History size={36} style={{ color: 'var(--color-text-muted)', margin: '0 auto 0.75rem' }} />
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              {filter === 'all'
                ? 'Belum ada setoran tersimpan. Mulai latihan sekarang!'
                : `Belum ada riwayat setoran untuk ${getMaterialLabel(filter as MaterialId)}`}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 sm:space-y-3">
            {submissions.map((s, idx) => (
              <div
                key={s.id ?? idx}
                className="card p-3.5 sm:p-4 flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                      {getMaterialLabel(s.materialId)}
                    </p>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 3,
                        fontSize: '0.65rem',
                        color: s.method === 'voice' ? 'var(--color-accent)' : 'var(--color-text-muted)',
                        background: s.method === 'voice' ? 'rgba(123,190,69,0.1)' : 'var(--color-bg-secondary)',
                        padding: '1px 6px',
                        borderRadius: 4,
                        border: `1px solid ${s.method === 'voice' ? 'rgba(123,190,69,0.3)' : 'var(--color-border)'}`,
                      }}
                    >
                      {s.method === 'voice' ? <Mic2 size={10} /> : <Keyboard size={10} />}
                      {s.method === 'voice' ? 'Suara' : 'Ketikan'}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                    {formatDateTime(s.createdAt)}
                  </p>

                  <div className="flex gap-3 mt-1.5 text-[0.7rem]">
                    <span style={{ color: 'var(--color-word-correct)' }}>✓ {s.correctWords} benar</span>
                    <span style={{ color: 'var(--color-word-incorrect)' }}>~ {s.incorrectWords} keliru</span>
                    <span style={{ color: 'var(--color-word-missing)' }}>✗ {s.missingWords} lewat</span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.4rem, 4vw, 1.75rem)',
                      fontWeight: 900,
                      color: getScoreColor(s.score),
                      lineHeight: 1,
                    }}
                  >
                    {s.score}%
                  </p>
                  <p style={{ fontSize: '0.62rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                    Akurasi
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
