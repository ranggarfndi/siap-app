'use client'

import { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import { Upload, AlertCircle, CheckCircle } from 'lucide-react'
import { BackupSchema, importBackup } from '@/lib/storage/backup'

interface DataImportProps {
  onImported?: () => void
}

export default function DataImport({ onImported }: DataImportProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<'idle' | 'preview' | 'success' | 'error'>('idle')
  const [parsed, setParsed] = useState<z.infer<typeof BackupSchema> | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [importing, setImporting] = useState(false)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string)
        const result = BackupSchema.safeParse(json)
        if (!result.success) {
          setErrorMsg('Format file backup tidak valid.')
          setStatus('error')
          return
        }
        setParsed(result.data)
        setStatus('preview')
      } catch {
        setErrorMsg('File tidak dapat dibaca sebagai JSON.')
        setStatus('error')
      }
    }
    reader.readAsText(file)
  }

  async function handleImport() {
    if (!parsed) return
    setImporting(true)
    try {
      await importBackup(parsed as Parameters<typeof importBackup>[0])
      setStatus('success')
      onImported?.()
    } catch (err) {
      setErrorMsg('Gagal mengimpor data. Silakan coba lagi.')
      setStatus('error')
    } finally {
      setImporting(false)
    }
  }

  function reset() {
    setParsed(null)
    setStatus('idle')
    setErrorMsg('')
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="space-y-3">
      <input
        ref={fileRef}
        type="file"
        accept=".json,application/json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        id="import-file-input"
      />

      {status === 'idle' && (
        <button
          onClick={() => fileRef.current?.click()}
          className="btn-ghost flex items-center gap-2 w-full justify-center"
          style={{ padding: '0.875rem' }}
        >
          <Upload size={16} /> Pilih File Backup (.json)
        </button>
      )}

      {status === 'preview' && parsed && (
        <div
          className="card"
          style={{ padding: '1rem', border: '1px solid rgba(201,163,61,0.4)' }}
        >
          <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-gold)', marginBottom: '0.5rem' }}>
            Preview Backup
          </p>
          <ul style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
            <li>📋 {parsed.submissions?.length ?? 0} setoran</li>
            <li>📊 {parsed.progress?.length ?? 0} data progress</li>
            <li>🏆 {parsed.achievements?.length ?? 0} pencapaian</li>
            <li>📅 Diekspor: {new Date(parsed.exportedAt).toLocaleDateString('id-ID')}</li>
          </ul>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-error)', marginBottom: '0.75rem' }}>
            ⚠️ Semua data saat ini akan digantikan.
          </p>
          <div className="flex gap-3">
            <button onClick={handleImport} className="btn-primary" disabled={importing}>
              {importing ? 'Mengimpor...' : 'Konfirmasi Import'}
            </button>
            <button onClick={reset} className="btn-ghost">Batal</button>
          </div>
        </div>
      )}

      {status === 'success' && (
        <div className="flex items-center gap-2" style={{ color: 'var(--color-success)', fontSize: '0.875rem' }}>
          <CheckCircle size={16} />
          <span>Data berhasil diimpor!</span>
          <button onClick={reset} className="btn-ghost" style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>Reset</button>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-2" style={{ color: 'var(--color-error)', fontSize: '0.875rem' }}>
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
          <button onClick={reset} className="btn-ghost" style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>Coba Lagi</button>
        </div>
      )}
    </div>
  )
}
