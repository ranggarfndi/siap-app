'use client'

import Link from 'next/link'
import { ArrowRight, History } from 'lucide-react'
import type { Submission } from '@/types'
import { getMaterialLabel } from '@/data/materials'

interface RecentHistoryProps {
  submissions: Submission[]
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Baru saja'
  if (minutes < 60) return `${minutes} menit lalu`
  if (hours < 24) return `${hours} jam lalu`
  if (days === 1) return 'Kemarin'
  return `${days} hari lalu`
}

function getScoreColor(score: number): string {
  if (score >= 90) return 'var(--color-success)'
  if (score >= 70) return 'var(--color-warning)'
  return 'var(--color-error)'
}

export default function RecentHistory({ submissions }: RecentHistoryProps) {
  if (submissions.length === 0) {
    return (
      <div className="card p-4 sm:p-5">
        <p className="section-label mb-2">RIWAYAT TERAKHIR</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '1rem 0' }}>
          Belum ada setoran tersimpan. Mulai hafalan sekarang!
        </p>
      </div>
    )
  }

  return (
    <div className="card p-3.5 sm:p-5">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <History size={15} style={{ color: 'var(--color-accent)' }} />
          <p className="section-label">RIWAYAT TERAKHIR</p>
        </div>
        <Link
          href="/riwayat"
          style={{ fontSize: '0.72rem', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: 3 }}
          className="hover:underline"
        >
          Lihat Semua <ArrowRight size={11} />
        </Link>
      </div>

      <ul className="divide-y divide-[var(--color-border)]">
        {submissions.slice(0, 5).map((s, idx) => (
          <li key={s.id ?? idx} className="flex items-center justify-between py-2.5">
            <div className="min-w-0 pr-2">
              <p
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {getMaterialLabel(s.materialId)}
              </p>
              <p style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: 1 }}>
                {formatRelativeTime(s.createdAt)} · via {s.method === 'voice' ? 'Suara' : 'Ketikan'}
              </p>
            </div>

            <span
              style={{
                fontSize: '1.15rem',
                fontWeight: 900,
                fontFamily: 'var(--font-display)',
                color: getScoreColor(s.score),
                flexShrink: 0,
              }}
            >
              {s.score}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
