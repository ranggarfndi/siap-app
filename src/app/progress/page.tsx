'use client'

import { useEffect, useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { getAllProgress } from '@/lib/storage/progress'
import { getSubmissions } from '@/lib/storage/submissions'
import { getActivityLast30Days } from '@/lib/storage/activity'
import { materials } from '@/data/materials'
import ProgressRing from '@/components/ui/ProgressRing'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { BarChart3 } from 'lucide-react'
import type { Progress, Submission, Activity } from '@/types'

export default function ProgressPage() {
  const [progressList, setProgressList] = useState<Progress[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [activity, setActivity] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [prog, subs, act] = await Promise.all([
        getAllProgress(),
        getSubmissions(),
        getActivityLast30Days(),
      ])
      setProgressList(prog)
      setSubmissions(subs)
      setActivity(act)
      setLoading(false)
    }
    load()
  }, [])

  const progressMap = Object.fromEntries(progressList.map((p) => [p.materialId, p]))
  const totalProgress =
    progressList.length > 0
      ? Math.round(progressList.reduce((acc, p) => acc + p.masteryPercent, 0) / progressList.length)
      : 0

  const avgScore =
    submissions.length > 0
      ? Math.round(submissions.reduce((acc, s) => acc + s.score, 0) / submissions.length)
      : 0
  const bestScore = submissions.length > 0 ? Math.max(...submissions.map((s) => s.score)) : 0

  // Chart data — last 14 submissions
  const chartData = [...submissions]
    .slice(0, 14)
    .reverse()
    .map((s, i) => ({
      name: `#${i + 1}`,
      skor: s.score,
    }))

  // Activity chart
  const activityChartData = activity.slice(-14).map((a) => ({
    name: a.date.slice(5), // MM-DD
    setoran: a.submissionCount,
  }))

  const TOOLTIP_STYLE = {
    background: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border)',
    borderRadius: 8,
    color: 'var(--color-text-primary)',
    fontSize: '0.78rem',
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[70vh]">
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
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="page-container max-w-4xl space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <BarChart3 size={18} style={{ color: 'var(--color-accent)' }} />
            <p className="section-label">STATISTIK & NILAI</p>
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
            PROGRESS HAFALAN
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Pantau grafik peningkatan akurasi dan konsistensi latihan dari waktu ke waktu.
          </p>
        </div>

        {/* 4 Summary Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {[
            { label: 'Progress Total', value: `${totalProgress}%`, color: 'var(--color-accent)' },
            { label: 'Rata-rata Skor', value: submissions.length ? `${avgScore}%` : '—', color: 'var(--color-text-primary)' },
            { label: 'Skor Terbaik', value: submissions.length ? `${bestScore}%` : '—', color: 'var(--color-gold)' },
            { label: 'Total Setoran', value: `${submissions.length}x`, color: 'var(--color-text-primary)' },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="card text-center p-3 sm:p-4"
              style={{ background: 'rgba(18,29,20,0.7)' }}
            >
              <p
                style={{
                  fontSize: 'clamp(1.35rem, 4vw, 1.75rem)',
                  fontWeight: 900,
                  fontFamily: 'var(--font-display)',
                  color,
                  lineHeight: 1.1,
                }}
              >
                {value}
              </p>
              <p style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Per-Material Mastery Cards */}
        <div>
          <p className="section-label mb-2.5">PROGRESS PER DOKTRIN</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {materials.map((m) => {
              const p = progressMap[m.id]
              return (
                <div
                  key={m.id}
                  className="card p-3.5 sm:p-4 flex items-center sm:flex-col justify-between sm:justify-center gap-3 text-left sm:text-center"
                >
                  <div className="flex items-center gap-3 sm:flex-col sm:gap-2">
                    <ProgressRing
                      percent={p?.masteryPercent ?? 0}
                      size={68}
                      strokeWidth={6}
                      color={m.color}
                      label={`${p?.masteryPercent ?? 0}%`}
                    />
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-text-primary)' }}>
                        {m.name}
                      </p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                        {m.itemCount} butir
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:justify-center gap-3 text-[0.72rem]">
                    <span style={{ color: 'var(--color-text-muted)' }}>
                      Terbaik: <strong style={{ color: m.color }}>{p?.bestScore ?? 0}%</strong>
                    </span>
                    <span style={{ color: 'var(--color-text-muted)' }}>
                      Setor: <strong style={{ color: 'var(--color-text-secondary)' }}>{p?.attemptCount ?? 0}x</strong>
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Line Chart — Score Trend */}
        {chartData.length > 1 && (
          <div className="card p-3.5 sm:p-5">
            <p className="section-label mb-3">TREN SKOR (14 SETORAN TERAKHIR)</p>
            <div style={{ height: 180, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Line
                    type="monotone"
                    dataKey="skor"
                    stroke="var(--color-accent)"
                    strokeWidth={2.5}
                    dot={{ fill: 'var(--color-accent)', r: 3.5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Bar Chart — Activity */}
        {activityChartData.length > 0 && (
          <div className="card p-3.5 sm:p-5">
            <p className="section-label mb-3">AKTIVITAS SETORAN (14 HARI TERAKHIR)</p>
            <div style={{ height: 150, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityChartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" tick={{ fill: 'var(--color-text-muted)', fontSize: 9 }} />
                  <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} allowDecimals={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="setoran" fill="var(--color-army-green)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {submissions.length === 0 && (
          <div className="card text-center p-8 sm:p-12">
            <BarChart3 size={36} style={{ color: 'var(--color-text-muted)', margin: '0 auto 0.75rem' }} />
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              Mulai setor hafalan untuk melihat grafik statistik dan perkembangan nilaimu.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
