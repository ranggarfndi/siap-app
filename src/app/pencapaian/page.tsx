'use client'

import { useEffect, useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { getAchievements } from '@/lib/storage/achievements'
import { ACHIEVEMENT_DEFINITIONS } from '@/lib/gamification/achievements'
import { getLevelFromXP, getXPForNextLevel } from '@/lib/gamification/levels'
import { getXP } from '@/lib/gamification/xp'
import { Trophy, Lock, CheckCircle2 } from 'lucide-react'
import type { Achievement } from '@/types'

export default function PencapaianPage() {
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set())
  const [unlockedMap, setUnlockedMap] = useState<Record<string, Achievement>>({})
  const [xp, setXp] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const achievements = await getAchievements()
      const ids = new Set(achievements.map((a) => a.achievementId as string))
      const map: Record<string, Achievement> = {}
      for (const a of achievements) map[a.achievementId] = a
      setUnlockedIds(ids)
      setUnlockedMap(map)
      setXp(getXP())
      setLoading(false)
    }
    load()
  }, [])

  const level = getLevelFromXP(xp)
  const { current, needed, percent } = getXPForNextLevel(xp)
  const unlockedCount = unlockedIds.size

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
      <div className="page-container max-w-3xl space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <Trophy size={18} style={{ color: 'var(--color-gold)' }} />
            <p className="section-label">PRESTASI & DISIPLIN</p>
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
            PENCAPAIAN PRAJURIT
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Raih poin pengalaman (XP), tingkatkan pangkat hafalan, dan buka seluruh lencana kehormatan.
          </p>
        </div>

        {/* Level & XP Overview Card */}
        <div
          className="card p-4 sm:p-5"
          style={{
            background: 'linear-gradient(135deg, var(--color-bg-card) 0%, rgba(201,163,61,0.12) 100%)',
            borderColor: 'rgba(201,163,61,0.35)',
          }}
        >
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <span className="badge badge-gold text-[0.65rem] py-0.5 px-2 mb-1">
                LEVEL {level.level}
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.25rem, 4vw, 1.6rem)',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  color: 'var(--color-gold)',
                }}
              >
                {level.name.toUpperCase()}
              </h2>
            </div>

            <div className="text-right">
              <p className="section-label text-[0.62rem]">TOTAL XP</p>
              <p
                suppressHydrationWarning
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                  fontWeight: 900,
                  color: 'var(--color-gold)',
                  lineHeight: 1,
                }}
              >
                {xp.toLocaleString()}
              </p>
            </div>
          </div>

          {needed > 0 ? (
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[0.72rem]">
                <span style={{ color: 'var(--color-text-muted)' }}>
                  {current} / {needed} XP menuju Level {level.level + 1}
                </span>
                <span style={{ color: 'var(--color-gold)', fontWeight: 700 }}>{percent}%</span>
              </div>
              <div style={{ height: 6, background: 'var(--color-border)', borderRadius: 999 }}>
                <div
                  style={{
                    height: '100%',
                    width: `${percent}%`,
                    background: 'var(--color-gold)',
                    borderRadius: 999,
                    transition: 'width 0.8s ease',
                  }}
                />
              </div>
            </div>
          ) : (
            <p style={{ fontSize: '0.8rem', color: 'var(--color-gold)', fontWeight: 700 }}>
              🏆 Pangkat Maksimal Telah Tercapai!
            </p>
          )}
        </div>

        {/* Achievement Stats Counter */}
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 text-secondary">
            <Trophy size={14} style={{ color: 'var(--color-gold)' }} />
            <span>
              <strong style={{ color: 'var(--color-text-primary)' }}>{unlockedCount}</strong> dari{' '}
              {ACHIEVEMENT_DEFINITIONS.length} lencana diraih
            </span>
          </div>
        </div>

        {/* 12 Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
          {ACHIEVEMENT_DEFINITIONS.map((def) => {
            const isUnlocked = unlockedIds.has(def.id)

            return (
              <div
                key={def.id}
                className="card p-3 sm:p-4 transition-all"
                style={{
                  opacity: isUnlocked ? 1 : 0.45,
                  border: isUnlocked ? '1px solid rgba(201,163,61,0.35)' : '1px solid var(--color-border)',
                  background: isUnlocked
                    ? 'linear-gradient(135deg, var(--color-bg-card), rgba(201,163,61,0.06))'
                    : 'var(--color-bg-card)',
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                    style={{
                      background: isUnlocked ? 'rgba(201,163,61,0.15)' : 'var(--color-bg-secondary)',
                      border: isUnlocked
                        ? '1px solid rgba(201,163,61,0.3)'
                        : '1px solid var(--color-border)',
                    }}
                  >
                    {isUnlocked ? def.icon : <Lock size={16} style={{ color: 'var(--color-text-muted)' }} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p
                        style={{
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          color: isUnlocked ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                        }}
                      >
                        {def.name}
                      </p>
                      {isUnlocked && (
                        <CheckCircle2 size={13} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                      )}
                    </div>

                    <p
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--color-text-muted)',
                        lineHeight: 1.35,
                        marginBottom: '0.4rem',
                      }}
                    >
                      {def.description}
                    </p>

                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: isUnlocked ? 'var(--color-gold)' : 'var(--color-text-muted)',
                      }}
                    >
                      +{def.xpReward} XP
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
