'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AppLayout from '@/components/layout/AppLayout'
import HeroSection from '@/components/dashboard/HeroSection'
import MaterialCards from '@/components/dashboard/MaterialCards'
import RecentHistory from '@/components/dashboard/RecentHistory'
import StreakBadge from '@/components/dashboard/StreakBadge'
import DailyTarget from '@/components/dashboard/DailyTarget'
import materials from '@/data/materials'
import { getAllProgress } from '@/lib/storage/progress'
import { getRecentSubmissions } from '@/lib/storage/submissions'
import { getSettings } from '@/lib/storage/settings'
import { getStreak, getTodayActivity } from '@/lib/storage/activity'
import { Mic2, BookOpen, Sparkles } from 'lucide-react'
import type { Progress, Submission, Activity } from '@/types'

export default function DashboardPage() {
  const [progressList, setProgressList] = useState<Progress[]>([])
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([])
  const [dailyTarget, setDailyTarget] = useState(3)
  const [todayActivity, setTodayActivity] = useState<Activity | undefined>()
  const [submittedTodayIds, setSubmittedTodayIds] = useState<string[]>([])
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [progList, recSubs, settings, todayAct, currentStreak] = await Promise.all([
          getAllProgress(),
          getRecentSubmissions(5),
          getSettings(),
          getTodayActivity(),
          getStreak(),
        ])

        setProgressList(progList)
        setRecentSubmissions(recSubs)
        setDailyTarget(settings.dailyTarget)
        setTodayActivity(todayAct)
        setStreak(currentStreak)

        if (todayAct) {
          const todaySubs = recSubs.filter((s) => {
            const d = new Date(s.createdAt)
            const today = new Date()
            return d.toDateString() === today.toDateString()
          })
          setSubmittedTodayIds([...new Set(todaySubs.map((s) => s.materialId))])
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const progressMap: Record<string, Progress | undefined> = Object.fromEntries(
    progressList.map((p) => [p.materialId, p])
  )
  const activeMaterials = progressList.filter((p) => p.masteryPercent >= 85).length
  const submissionCount = progressList.reduce((acc, p) => acc + p.attemptCount, 0)
  const totalProgress =
    progressList.length > 0
      ? Math.round(
          progressList.reduce((acc, p) => acc + p.masteryPercent, 0) / materials.length
        )
      : 0

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <div
            style={{
              width: 36,
              height: 36,
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
      <div className="page-container space-y-4 sm:space-y-6">
        {/* Hero Section */}
        <HeroSection
          totalProgress={totalProgress}
          activeMaterials={activeMaterials}
          totalMaterials={materials.length}
          totalSubmissions={submissionCount}
          progressList={progressList}
        />

        {/* Quick Actions Grid (3 Columns) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
          <Link
            href="/setor"
            className="card card-hover flex items-center gap-2.5 sm:gap-3.5 p-3 sm:p-4 active:scale-[0.98] transition-all"
          >
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: 'rgba(123,190,69,0.15)',
                border: '1px solid rgba(123,190,69,0.3)',
              }}
            >
              <Mic2 size={18} style={{ color: 'var(--color-accent)' }} />
            </div>
            <div className="min-w-0">
              <p
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  lineHeight: 1.2,
                }}
              >
                Setor Hafalan
              </p>
              <p style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                Suara & ketikan
              </p>
            </div>
          </Link>

          <Link
            href="/latihan"
            className="card card-hover flex items-center gap-2.5 sm:gap-3.5 p-3 sm:p-4 active:scale-[0.98] transition-all"
          >
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: 'rgba(201,163,61,0.12)',
                border: '1px solid rgba(201,163,61,0.25)',
              }}
            >
              <BookOpen size={18} style={{ color: 'var(--color-gold)' }} />
            </div>
            <div className="min-w-0">
              <p
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  lineHeight: 1.2,
                }}
              >
                Pusat Latihan
              </p>
              <p style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                Belajar & flashcard
              </p>
            </div>
          </Link>

          <Link
            href="/kartu"
            className="col-span-2 sm:col-span-1 card card-hover flex items-center gap-2.5 sm:gap-3.5 p-3 sm:p-4 active:scale-[0.98] transition-all"
            style={{
              background: 'linear-gradient(135deg, var(--color-bg-card) 0%, rgba(201,163,61,0.08) 100%)',
              borderColor: 'rgba(201,163,61,0.3)',
            }}
          >
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: 'rgba(201,163,61,0.18)',
                border: '1px solid rgba(201,163,61,0.35)',
              }}
            >
              <Sparkles size={18} style={{ color: 'var(--color-gold)' }} />
            </div>
            <div className="min-w-0">
              <p
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  lineHeight: 1.2,
                }}
              >
                Kartu Doktrin
              </p>
              <p style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                Unduh kartu HD
              </p>
            </div>
          </Link>
        </div>

        {/* Material Cards */}
        <div>
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <p className="section-label">MATERI HAFALAN</p>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
              {materials.length} Doktrin Utama
            </span>
          </div>
          <MaterialCards materials={materials} progressMap={progressMap} />
        </div>

        {/* Bottom Grid: Recent history + Streak & Daily Target */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <RecentHistory submissions={recentSubmissions} />
          </div>
          <div className="space-y-4">
            <StreakBadge streak={streak} />
            <DailyTarget
              target={dailyTarget}
              todayActivity={todayActivity}
              materials={materials}
              submittedMaterialIds={submittedTodayIds}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
