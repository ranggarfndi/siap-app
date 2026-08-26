'use client'

import { useState, useRef } from 'react'
import { Lock, Shield } from 'lucide-react'

interface TextSubmissionProps {
  onSubmit: (text: string) => void
  disabled?: boolean
  maxLength?: number
}

export default function TextSubmission({
  onSubmit,
  disabled = false,
  maxLength = 5000,
}: TextSubmissionProps) {
  const [text, setText] = useState('')
  const [pureMode, setPureMode] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleSubmit() {
    if (!text.trim()) return
    onSubmit(text.trim())
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (pureMode && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
      e.preventDefault()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    if (pureMode) {
      e.preventDefault()
    }
  }

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* Pure Mode Toggle Card */}
      <div
        className="card flex items-center justify-between p-3 sm:p-4"
        style={{ background: 'rgba(18,29,20,0.85)' }}
      >
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: pureMode ? 'rgba(201,163,61,0.15)' : 'rgba(103,112,101,0.15)',
              color: pureMode ? 'var(--color-gold)' : 'var(--color-text-muted)',
            }}
          >
            {pureMode ? <Shield size={16} /> : <Lock size={16} />}
          </div>
          <div className="min-w-0">
            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Mode Hafalan Murni
            </p>
            <p style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', lineHeight: 1.2 }}>
              {pureMode ? 'Paste dinonaktifkan (ketik murni)' : 'Aktifkan untuk cegah paste'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setPureMode(!pureMode)}
          aria-label="Toggle Mode Hafalan Murni"
          style={{
            width: 44,
            height: 24,
            borderRadius: 12,
            background: pureMode ? 'var(--color-gold)' : 'var(--color-border)',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            transition: 'background 0.25s',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 2,
              left: pureMode ? 22 : 2,
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: 'white',
              transition: 'left 0.25s',
            }}
          />
        </button>
      </div>

      {/* Textarea Container */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, maxLength))}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          disabled={disabled}
          placeholder="Ketik hafalanmu di sini tanpa melihat teks referensi..."
          rows={7}
          style={{
            width: '100%',
            background: 'var(--color-bg-card)',
            border: `1px solid ${text.length > maxLength * 0.9 ? 'var(--color-warning)' : 'var(--color-border)'}`,
            borderRadius: 12,
            padding: 'clamp(0.875rem, 3vw, 1.25rem)',
            color: 'var(--color-text-primary)',
            fontSize: '1rem', // 16px to prevent iOS auto-zoom
            lineHeight: 1.75,
            resize: 'vertical',
            outline: 'none',
            minHeight: 160,
          }}
        />

        {pureMode && (
          <div className="absolute top-2.5 right-2.5 pointer-events-none">
            <span className="badge badge-gold text-[0.65rem] py-0.5 px-2">
              <Lock size={10} /> MURNI
            </span>
          </div>
        )}
      </div>

      {/* Character Count & Submit */}
      <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-3 pt-1">
        <span
          suppressHydrationWarning
          style={{
            fontSize: '0.72rem',
            color: text.length > maxLength * 0.9 ? 'var(--color-warning)' : 'var(--color-text-muted)',
          }}
        >
          {text.length} / {maxLength} karakter
        </span>

        <button
          onClick={handleSubmit}
          disabled={!text.trim() || disabled}
          className="btn-primary w-full xs:w-auto text-xs sm:text-sm py-2.5 px-5"
          style={{
            opacity: !text.trim() || disabled ? 0.4 : 1,
            cursor: !text.trim() || disabled ? 'not-allowed' : 'pointer',
          }}
        >
          KIRIM SETORAN →
        </button>
      </div>
    </div>
  )
}
