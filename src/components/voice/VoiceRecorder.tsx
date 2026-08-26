'use client'

import { useState, useEffect } from 'react'
import { Mic, Square, AlertCircle, CheckCircle, RefreshCcw } from 'lucide-react'
import AudioWaveform from './AudioWaveform'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import type { VoiceRecorderState } from '@/types'

interface VoiceRecorderProps {
  onTranscriptReady: (transcript: string, duration: number) => void
  disabled?: boolean
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const STATE_MESSAGES: Record<VoiceRecorderState, string> = {
  idle: 'Ketuk microphone di bawah untuk mulai merekam',
  requesting_permission: 'Menyiapkan microphone...',
  recording: '● MENDENGARKAN SUARA PRAJURIT...',
  processing: 'Memproses rekaman suara...',
  transcribing: 'Menganalisis & mengubah suara...',
  completed: 'Transkripsi berhasil, sedang menilai...',
  error: 'Terjadi kesalahan pada mikrofon',
}

export default function VoiceRecorder({ onTranscriptReady, disabled = false }: VoiceRecorderProps) {
  const [timer, setTimer] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')

  const { state, isSupported, startRecording, stopRecording, reset } =
    useSpeechRecognition({
      language: 'id-ID',
      onResult: ({ transcript: t, duration }) => {
        onTranscriptReady(t, duration)
      },
      onError: (err) => setErrorMessage(err),
    })

  const isRecording = state === 'recording'
  const isProcessing = state === 'processing' || state === 'transcribing'
  const isCompleted = state === 'completed'
  const isError = state === 'error'

  useEffect(() => {
    if (!isRecording) return
    setTimer(0)
    const id = setInterval(() => setTimer((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [isRecording])

  // Max 5 minutes
  useEffect(() => {
    if (timer >= 300) stopRecording()
  }, [timer, stopRecording])

  function handleReset() {
    reset()
    setTimer(0)
    setErrorMessage('')
  }

  if (!isSupported) {
    return (
      <div
        className="card text-center p-5 sm:p-8"
        style={{
          border: '1px solid rgba(217,83,79,0.3)',
          background: 'rgba(217,83,79,0.05)',
        }}
      >
        <AlertCircle size={32} style={{ color: 'var(--color-error)', margin: '0 auto 0.75rem' }} />
        <p style={{ color: 'var(--color-error)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
          Fitur Suara Belum Didukung di Browser Ini
        </p>
        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
          Gunakan Google Chrome atau Microsoft Edge di smartphone / komputer Anda untuk menggunakan setor suara langsung.
        </p>
      </div>
    )
  }

  return (
    <div
      className="card text-center"
      style={{
        padding: 'clamp(1.25rem, 4vw, 2rem)',
        background: 'linear-gradient(180deg, var(--color-bg-card) 0%, rgba(18,29,20,0.95) 100%)',
      }}
    >
      {/* Status indicator */}
      <div className="mb-4 sm:mb-6">
        <p
          style={{
            fontSize: '0.8rem',
            color: isRecording
              ? 'var(--color-error)'
              : isCompleted
              ? 'var(--color-success)'
              : isError
              ? 'var(--color-error)'
              : 'var(--color-text-secondary)',
            fontWeight: isRecording ? 700 : 500,
            letterSpacing: isRecording ? '0.06em' : 0,
            animation: isRecording ? 'recordPulse 1.5s ease-in-out infinite' : 'none',
          }}
        >
          {isError ? errorMessage || STATE_MESSAGES.error : STATE_MESSAGES[state]}
        </p>

        {isRecording && (
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 7vw, 2.75rem)',
              fontWeight: 900,
              color: 'var(--color-text-primary)',
              lineHeight: 1,
              marginTop: '0.4rem',
            }}
          >
            {formatTime(timer)}
          </p>
        )}
      </div>

      {/* Waveform */}
      <div className="mb-6 flex justify-center" style={{ minHeight: 44 }}>
        <AudioWaveform isRecording={isRecording} />
      </div>

      {/* Main Microphone Action Button */}
      <div className="flex justify-center mb-3">
        {!isRecording && !isProcessing && !isCompleted ? (
          <button
            type="button"
            onClick={startRecording}
            disabled={disabled}
            aria-label="Mulai Merekam Suara"
            style={{
              width: 86,
              height: 86,
              borderRadius: '50%',
              background: isError ? 'rgba(217,83,79,0.15)' : 'rgba(123,190,69,0.15)',
              border: `2.5px solid ${isError ? 'rgba(217,83,79,0.6)' : 'rgba(123,190,69,0.6)'}`,
              cursor: disabled ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              animation: !isError ? 'pulseRing 2s ease-in-out infinite' : 'none',
              opacity: disabled ? 0.4 : 1,
            }}
            className="active:scale-95"
          >
            <Mic size={34} style={{ color: isError ? 'var(--color-error)' : 'var(--color-accent)' }} />
          </button>
        ) : isRecording ? (
          <button
            type="button"
            onClick={stopRecording}
            aria-label="Hentikan Rekaman dan Nilai"
            style={{
              width: 86,
              height: 86,
              borderRadius: '50%',
              background: 'rgba(217,83,79,0.22)',
              border: '2.5px solid rgba(217,83,79,0.7)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
            }}
            className="active:scale-95"
          >
            <Square size={30} style={{ color: 'var(--color-error)' }} />
          </button>
        ) : isProcessing ? (
          <div
            style={{
              width: 86,
              height: 86,
              borderRadius: '50%',
              border: '3px solid var(--color-border)',
              borderTop: '3px solid var(--color-accent)',
              animation: 'spin 0.8s linear infinite',
            }}
          />
        ) : isCompleted ? (
          <div
            style={{
              width: 86,
              height: 86,
              borderRadius: '50%',
              background: 'rgba(118,196,66,0.18)',
              border: '2.5px solid rgba(118,196,66,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle size={36} style={{ color: 'var(--color-success)' }} />
          </div>
        ) : null}
      </div>

      <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
        {isRecording
          ? 'Tekan tombol kotak merah untuk selesai & langsung kirim'
          : 'Ucapkan butir hafalan dengan jelas & lantang'}
      </p>

      {/* Reset button if error */}
      {isError && (
        <div className="flex justify-center pt-2">
          <button
            onClick={handleReset}
            className="btn-ghost flex items-center gap-1.5 text-xs py-2 px-3.5"
          >
            <RefreshCcw size={14} /> Coba Rekam Lagi
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulseRing {
          0%, 100% { box-shadow: 0 0 0 0 rgba(123,190,69,0.35); }
          50% { box-shadow: 0 0 0 14px rgba(123,190,69,0); }
        }
        @keyframes recordPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
