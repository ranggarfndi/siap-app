'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AppLayout from '@/components/layout/AppLayout'
import ScoreCircle from '@/components/ui/ScoreCircle'
import WordDiff from '@/components/scoring/WordDiff'
import { getMaterialLabel } from '@/data/materials'
import { RotateCcw, Home, ChevronDown, ChevronUp, BookOpen, Mic2, Keyboard } from 'lucide-react'
import type { ScoreResult, MaterialId, SubmissionMethod } from '@/types'

interface StoredResult extends ScoreResult {
  materialId: MaterialId
  method: SubmissionMethod
  submissionId: number
}

export default function HasilPage() {
  const router = useRouter()
  const [result, setResult] = useState<StoredResult | null>(null)
  const [showDiff, setShowDiff] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('siap_last_result')
    if (!stored) {
      router.replace('/')
      return
    }
    try {
      setResult(JSON.parse(stored))
    } catch {
      router.replace('/')
    }
  }, [router])

  if (!result) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <div
            style={{
              width: 36,
              height: 36,
              border: '3px solid var(--color-border)',
              borderTop: '3px solid var(--color-accent)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </AppLayout>
    )
  }

  const stats = [
    { label: 'Benar', value: result.correctWords, color: 'var(--color-word-correct)' },
    { label: 'Kurang Tepat', value: result.incorrectWords, color: 'var(--color-word-incorrect)' },
    { label: 'Terlewat', value: result.missingWords, color: 'var(--color-word-missing)' },
    { label: 'Tambahan', value: result.extraWords, color: 'var(--color-word-extra)' },
  ]

  return (
    <AppLayout>
      <div className="page-container max-w-2xl space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center pt-1">
          <p className="section-label mb-1">HASIL EVALUASI SETORAN</p>
          <div className="flex items-center justify-center gap-2">
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.3rem, 4vw, 1.75rem)',
                fontWeight: 800,
                color: 'var(--color-text-primary)',
              }}
            >
              {getMaterialLabel(result.materialId)}
            </h1>
            <span className="badge badge-accent text-[0.68rem] py-0.5 px-2">
              {result.method === 'voice' ? <Mic2 size={11} /> : <Keyboard size={11} />}
              {result.method === 'voice' ? 'Suara' : 'Ketikan'}
            </span>
          </div>
        </div>

        {/* Score & Feedback Card */}
        <div
          className="card text-center relative overflow-hidden"
          style={{
            padding: 'clamp(1.5rem, 5vw, 2.25rem)',
            background: 'linear-gradient(180deg, var(--color-bg-card) 0%, rgba(18,29,20,0.95) 100%)',
          }}
        >
          <ScoreCircle score={result.score} size={130} animated />
          <p
            style={{
              marginTop: '1.25rem',
              fontSize: 'clamp(0.88rem, 2.5vw, 1rem)',
              color: 'var(--color-text-secondary)',
              maxWidth: 440,
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: 1.6,
            }}
          >
            {result.feedback}
          </p>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {stats.map(({ label, value, color }) => (
            <div
              key={label}
              className="card text-center p-3 sm:p-4"
              style={{ background: 'rgba(18,29,20,0.7)' }}
            >
              <p
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 1.85rem)',
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

        {/* Word Diff Expandable Section */}
        <div>
          <button
            type="button"
            onClick={() => setShowDiff(!showDiff)}
            className="card w-full flex items-center justify-between p-3.5 sm:p-4 text-left transition-all active:scale-[0.99]"
            style={{ background: 'var(--color-bg-card)', cursor: 'pointer' }}
          >
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>
              {showDiff ? 'Sembunyikan Analisis Kata' : '🔍 Pelajari Analisis Kesalahan Kata'}
            </span>
            {showDiff ? (
              <ChevronUp size={18} style={{ color: 'var(--color-text-muted)' }} />
            ) : (
              <ChevronDown size={18} style={{ color: 'var(--color-text-muted)' }} />
            )}
          </button>

          {showDiff && (
            <div className="mt-3">
              <WordDiff
                referenceWords={result.comparison.referenceWords}
                userWords={result.comparison.userWords}
              />
            </div>
          )}
        </div>

        {/* Responsive Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-2">
          <Link
            href={`/setor/${result.materialId}`}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-xs sm:text-sm"
          >
            <RotateCcw size={15} /> Coba Setor Lagi
          </Link>

          <Link
            href={`/latihan/${result.materialId}`}
            className="btn-ghost w-full flex items-center justify-center gap-2 py-3 text-xs sm:text-sm"
          >
            <BookOpen size={15} /> Buka Mode Latihan
          </Link>

          <Link
            href="/"
            className="btn-ghost w-full flex items-center justify-center gap-2 py-3 text-xs sm:text-sm"
          >
            <Home size={15} /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    </AppLayout>
  )
}
