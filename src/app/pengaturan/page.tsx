'use client'

import { useEffect, useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { getSettings, updateSettings } from '@/lib/storage/settings'
import { exportBackup, downloadJson, resetAllData } from '@/lib/storage/backup'
import DataImport from '@/components/settings/DataImport'
import { Settings as SettingsIcon, Download, RefreshCcw, AlertTriangle, Info, Check } from 'lucide-react'
import type { Settings } from '@/types'

export default function PengaturanPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [resetDone, setResetDone] = useState(false)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    getSettings().then((s) => {
      setSettings(s)
      setLoading(false)
    })
  }, [])

  async function handleUpdate(partial: Partial<Settings>) {
    await updateSettings(partial)
    setSettings((prev) => (prev ? { ...prev, ...partial } : prev))
  }

  async function handleExport() {
    setExporting(true)
    try {
      const data = await exportBackup()
      downloadJson(data)
    } finally {
      setExporting(false)
    }
  }

  async function handleReset() {
    await resetAllData()
    localStorage.removeItem('siap_xp')
    setShowResetConfirm(false)
    setResetDone(true)
  }

  if (loading || !settings) {
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
      <div className="page-container max-w-xl space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <SettingsIcon size={18} style={{ color: 'var(--color-accent)' }} />
            <p className="section-label">PENGATURAN & DATA</p>
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
            PENGATURAN
          </h1>
        </div>

        {/* Local Storage Info Notice */}
        <div
          className="card p-3 sm:p-4 flex gap-3 items-start"
          style={{
            border: '1px solid rgba(91,155,213,0.3)',
            background: 'rgba(91,155,213,0.06)',
          }}
        >
          <Info size={18} style={{ color: 'var(--color-info)', flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            Data tersimpan aman secara lokal di browser perangkat Anda. Gunakan menu <strong>Export Data</strong>{' '}
            untuk mencadangkan riwayat hafalan Anda secara berkala.
          </p>
        </div>

        {/* Preferences Card */}
        <div className="card p-3.5 sm:p-5 space-y-4">
          <p className="section-label">PREFERENSI APLIKASI</p>

          <div className="flex items-center justify-between gap-3">
            <div>
              <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                Target Harian
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                Jumlah setoran hafalan per hari
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleUpdate({ dailyTarget: Math.max(1, settings.dailyTarget - 1) })}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                }}
                className="active:scale-95"
              >
                −
              </button>

              <span
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-accent)',
                  minWidth: 28,
                  textAlign: 'center',
                }}
              >
                {settings.dailyTarget}
              </span>

              <button
                type="button"
                onClick={() => handleUpdate({ dailyTarget: Math.min(10, settings.dailyTarget + 1) })}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                }}
                className="active:scale-95"
              >
                +
              </button>
            </div>
          </div>

          <hr className="divider" />

          {/* Animation Switch */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                Animasi UI
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                Efek transisi & gelombang waveform
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleUpdate({ animationEnabled: !settings.animationEnabled })}
              aria-label="Toggle Animasi"
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                background: settings.animationEnabled ? 'var(--color-accent)' : 'var(--color-border)',
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
                  left: settings.animationEnabled ? 22 : 2,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'white',
                  transition: 'left 0.25s',
                }}
              />
            </button>
          </div>
        </div>

        {/* Backup & Portability Card */}
        <div className="card p-3.5 sm:p-5 space-y-4">
          <p className="section-label">PENCADANGAN DATA (BACKUP)</p>

          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.2rem' }}>
              Ekspor Data Cadangan
            </p>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
              Unduh seluruh log hafalan, riwayat, dan pencapaian ke file <code>.json</code>.
            </p>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="btn-ghost w-full sm:w-auto flex items-center justify-center gap-2 text-xs py-2.5 px-4"
            >
              <Download size={14} /> {exporting ? 'Menyiapkan File...' : 'Ekspor Backup JSON'}
            </button>
          </div>

          <hr className="divider" />

          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.2rem' }}>
              Impor Data Cadangan
            </p>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
              Pulihkan data dari file backup yang pernah diekspor sebelumnya.
            </p>
            <DataImport />
          </div>
        </div>

        {/* Danger Zone: Reset Data */}
        <div
          className="card p-3.5 sm:p-5 space-y-3"
          style={{
            border: '1px solid rgba(217,83,79,0.3)',
            background: 'rgba(217,83,79,0.03)',
          }}
        >
          <p className="section-label" style={{ color: 'var(--color-error)' }}>
            ZONA PENGHAPUSAN
          </p>

          {resetDone ? (
            <div className="flex items-center gap-2 text-success text-xs font-semibold py-2">
              <Check size={16} />
              <span>Seluruh data hafalan berhasil direset bersih.</span>
            </div>
          ) : !showResetConfirm ? (
            <div className="space-y-3">
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  Hapus Seluruh Data Latihan
                </p>
                <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                  Menghapus permanen seluruh riwayat setoran, progres, dan lencana di perangkat ini.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="btn-ghost w-full sm:w-auto flex items-center justify-center gap-2 text-xs py-2.5 px-4"
                style={{ color: 'var(--color-error)', borderColor: 'rgba(217,83,79,0.45)' }}
              >
                <RefreshCcw size={14} /> Reset Data Sekarang
              </button>
            </div>
          ) : (
            <div
              className="card p-3 sm:p-4 space-y-3"
              style={{
                border: '1px solid rgba(217,83,79,0.5)',
                background: 'rgba(217,83,79,0.08)',
              }}
            >
              <div className="flex gap-2.5 items-start">
                <AlertTriangle size={18} style={{ color: 'var(--color-error)', flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  Apakah Anda yakin? Seluruh progres, grafik, dan XP prajurit akan dihapus dan tidak dapat dikembalikan.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-lg font-bold text-xs cursor-pointer text-white"
                  style={{ background: 'var(--color-error)' }}
                >
                  Ya, Hapus Semua Data
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="btn-ghost w-full sm:w-auto text-xs py-2 px-3"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
