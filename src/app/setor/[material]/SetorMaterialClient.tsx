'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Keyboard, Mic2 } from 'lucide-react'
import TextSubmission from '@/components/memorization/TextSubmission'
import VoiceRecorder from '@/components/voice/VoiceRecorder'
import { scoreSubmission } from '@/lib/scoring/score'
import { saveSubmission } from '@/lib/storage/submissions'
import { upsertProgress } from '@/lib/storage/progress'
import { recordActivity } from '@/lib/storage/activity'
import { awardXPForSubmission } from '@/lib/gamification/xp'
import { unlockAchievement } from '@/lib/storage/achievements'
import { getSubmissionCount } from '@/lib/storage/submissions'
import type { Material, ScoreResult, SubmissionMethod } from '@/types'

type SetorMethod = 'typed' | 'voice'

interface SetorMaterialClientProps {
  material: Material
}

export default function SetorMaterialClient({ material }: SetorMaterialClientProps) {
  const router = useRouter()
  const [method, setMethod] = useState<SetorMethod>('typed')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingMessage, setProcessingMessage] = useState('Memeriksa hafalan...')

  // Full material text (all items joined)
  const referenceText = material.items.map((item) => item.text).join(' ')

  const processSubmission = useCallback(
    async (inputText: string, transcript?: string, duration?: number, submitMethod: SubmissionMethod = method) => {
      setIsProcessing(true)
      setProcessingMessage(
        submitMethod === 'voice'
          ? 'Memeriksa & menilai rekaman suara...'
          : 'Memeriksa & menilai ketikan hafalan...'
      )

      try {
        const result: ScoreResult = scoreSubmission(inputText, referenceText)
        const submissionId = await saveSubmission({
          materialId: material.id,
          method: submitMethod,
          inputText,
          transcriptText: transcript ?? null,
          score: result.score,
          correctWords: result.correctWords,
          incorrectWords: result.incorrectWords,
          missingWords: result.missingWords,
          extraWords: result.extraWords,
          durationSeconds: duration ?? null,
          comparisonResult: result.comparison,
          createdAt: new Date(),
        })

        await upsertProgress(material.id, result.score)
        await recordActivity('submission')
        awardXPForSubmission(result.score)

        // Check achievements
        const count = await getSubmissionCount()
        if (count === 1) await unlockAchievement('first-submission')
        if (count >= 10) await unlockAchievement('submissions-10')
        if (count >= 30) await unlockAchievement('submissions-30')
        if (count >= 100) await unlockAchievement('submissions-100')
        if (result.score === 100) await unlockAchievement('perfect-score')
        if (submitMethod === 'voice') await unlockAchievement('voice-submission')
        if (result.score === 100) {
          if (material.id === 'sapta-marga') await unlockAchievement('sapta-marga-100')
          if (material.id === 'sumpah-prajurit') await unlockAchievement('sumpah-prajurit-100')
          if (material.id === '8-wajib-tni') await unlockAchievement('8-wajib-tni-100')
        }

        // Store result in session for hasil page
        sessionStorage.setItem(
          'siap_last_result',
          JSON.stringify({ ...result, materialId: material.id, method: submitMethod, submissionId })
        )

        router.push('/hasil')
      } catch (error) {
        console.error('Error processing submission:', error)
        setIsProcessing(false)
      }
    },
    [material, method, referenceText, router]
  )

  const handleVoiceReady = useCallback(
    (transcript: string, duration: number) => {
      // Langsung kirim otomatis tanpa preview / klik manual
      processSubmission(transcript, transcript, duration, 'voice')
    },
    [processSubmission]
  )

  return (
    <div style={{ padding: 'clamp(1rem, 4vw, 2rem)', maxWidth: 800, margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div
        className="flex items-center gap-2 mb-4"
        style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}
      >
        <Link href="/setor" className="flex items-center gap-1 hover:text-accent transition-colors">
          <ChevronLeft size={14} /> Setor
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--color-text-primary)' }}>{material.name}</span>
      </div>

      {/* Header */}
      <div
        className="card"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          background: `linear-gradient(135deg, var(--color-bg-card), ${material.color}15)`,
          borderColor: `${material.color}40`,
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.3rem',
            fontWeight: 800,
            letterSpacing: '0.07em',
            color: material.color,
            marginBottom: '0.25rem',
          }}
        >
          SETOR HAFALAN — {material.name.toUpperCase()}
        </h1>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
          {material.itemCount} butir · Ucapkan atau ketik hafalan tanpa melihat teks
        </p>
      </div>

      {/* Method selector */}
      <div
        className="flex gap-1 mb-5 p-1 rounded-lg"
        style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
      >
        <button
          onClick={() => setMethod('typed')}
          disabled={isProcessing}
          className="flex items-center gap-2 flex-1 justify-center py-2.5 rounded-md transition-all duration-200"
          style={{
            background: method === 'typed' ? 'var(--color-bg-elevated)' : 'transparent',
            color: method === 'typed' ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
            border: method === 'typed' ? '1px solid var(--color-border-accent)' : '1px solid transparent',
            fontSize: '0.875rem',
            fontWeight: method === 'typed' ? 700 : 400,
            cursor: isProcessing ? 'not-allowed' : 'pointer',
          }}
        >
          <Keyboard size={15} /> Ketikan
        </button>
        <button
          onClick={() => setMethod('voice')}
          disabled={isProcessing}
          className="flex items-center gap-2 flex-1 justify-center py-2.5 rounded-md transition-all duration-200"
          style={{
            background: method === 'voice' ? 'rgba(123,190,69,0.12)' : 'transparent',
            color: method === 'voice' ? 'var(--color-accent)' : 'var(--color-text-muted)',
            border: method === 'voice' ? '1px solid rgba(123,190,69,0.3)' : '1px solid transparent',
            fontSize: '0.875rem',
            fontWeight: method === 'voice' ? 700 : 400,
            cursor: isProcessing ? 'not-allowed' : 'pointer',
          }}
        >
          <Mic2 size={15} /> Suara
        </button>
      </div>

      {/* Submission area */}
      {method === 'typed' ? (
        <TextSubmission
          onSubmit={(text) => processSubmission(text, undefined, undefined, 'typed')}
          disabled={isProcessing}
        />
      ) : (
        <div className="space-y-4">
          <VoiceRecorder onTranscriptReady={handleVoiceReady} disabled={isProcessing} />
        </div>
      )}

      {/* Processing overlay */}
      {isProcessing && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(7,17,12,0.85)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              border: '3px solid var(--color-border)',
              borderTop: '3px solid var(--color-accent)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <p style={{ color: 'var(--color-text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>
            {processingMessage}
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </div>
  )
}
