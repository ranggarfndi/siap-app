'use client'

import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import AppLayout from '@/components/layout/AppLayout'
import DoctrineCard, { type CardTheme } from '@/components/cards/DoctrineCard'
import materials from '@/data/materials'
import { Download, Check, Palette, Share2, Sparkles, Copy, Eye } from 'lucide-react'

export default function KartuDoktrinPage() {
  const [selectedMaterialId, setSelectedMaterialId] = useState(materials[0].id)
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>('tactical')
  const [downloading, setDownloading] = useState(false)
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const activeMaterial = materials.find((m) => m.id === selectedMaterialId) ?? materials[0]

  async function handleDownload() {
    if (!cardRef.current || downloading) return
    setDownloading(true)

    try {
      // High-resolution canvas rendering (scale: 2 for ultra crisp 2x DPI export)
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      })

      const dataUrl = canvas.toDataURL('image/png', 1.0)
      const link = document.createElement('a')
      const fileName = `siap-kartu-${activeMaterial.id}-${selectedTheme}.png`
      link.download = fileName
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Gagal mengunduh kartu:', err)
      alert('Maaf, terjadi kendala saat merender gambar kartu. Silakan coba lagi.')
    } finally {
      setDownloading(false)
    }
  }

  async function handleShare() {
    if (!cardRef.current || downloading) return

    if (navigator.share) {
      try {
        setDownloading(true)
        const canvas = await html2canvas(cardRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
        })
        const dataUrl = canvas.toDataURL('image/png', 1.0)
        const res = await fetch(dataUrl)
        const blob = await res.blob()
        const file = new File([blob], `siap-kartu-${activeMaterial.id}.png`, { type: 'image/png' })

        await navigator.share({
          title: `Kartu Doktrin ${activeMaterial.name} — SIAP`,
          text: `Kartu pedoman resmi ${activeMaterial.name} dari SIAP (Sistem Interaktif Asah Prajurit).`,
          files: [file],
        })
      } catch {
        // User cancelled share dialog
      } finally {
        setDownloading(false)
      }
    } else {
      handleDownload()
    }
  }

  function handleCopyText() {
    const textToCopy = `${activeMaterial.name.toUpperCase()}\n\n${activeMaterial.items
      .map((item) => `${item.number}. ${item.text}`)
      .join('\n\n')}\n\n— SIAP (Sistem Interaktif Asah Prajurit)`

    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AppLayout>
      <div className="page-container max-w-4xl space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles size={16} style={{ color: 'var(--color-gold)' }} />
            <p className="section-label">KOLEKSI & KARTU PRAJURIT</p>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.4rem, 4vw, 2.2rem)',
              fontWeight: 800,
              letterSpacing: '0.05em',
              color: 'var(--color-text-primary)',
            }}
          >
            KARTU DOKTRIN TNI
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Kartu doktrin taktis potret beresolusi tinggi dengan font besar yang jelas. Unduh secara instan sebagai wallpaper smartphone, poster hafalan, atau kartu saku prajurit.
          </p>
        </div>

        {/* Material Selection Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
          {materials.map((m) => {
            const isSelected = m.id === selectedMaterialId
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMaterialId(m.id)}
                className="py-2.5 px-2 text-center rounded-lg transition-all text-xs sm:text-sm font-bold flex flex-col items-center justify-center gap-0.5 active:scale-95"
                style={{
                  background: isSelected ? 'var(--color-bg-secondary)' : 'transparent',
                  color: isSelected ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  border: isSelected ? '1px solid rgba(123,190,69,0.3)' : '1px solid transparent',
                  boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
                }}
              >
                <span>{m.name}</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 500, opacity: 0.75 }}>
                  {m.itemCount} Butir
                </span>
              </button>
            )
          })}
        </div>

        {/* Theme Selector & Actions Bar */}
        <div className="card p-3.5 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Theme buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <div className="flex items-center gap-1 text-xs text-muted mr-1">
              <Palette size={14} />
              <span className="hidden xs:inline">Tema:</span>
            </div>

            <button
              onClick={() => setSelectedTheme('tactical')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0"
              style={{
                background: selectedTheme === 'tactical' ? '#485B2C' : 'var(--color-bg-secondary)',
                color: selectedTheme === 'tactical' ? '#FFFFFF' : 'var(--color-text-muted)',
                border: '1px solid var(--color-border)',
              }}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#7BBE45]" />
              Tactical Army
            </button>

            <button
              onClick={() => setSelectedTheme('gold')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0"
              style={{
                background: selectedTheme === 'gold' ? '#8C6F23' : 'var(--color-bg-secondary)',
                color: selectedTheme === 'gold' ? '#FAF7EE' : 'var(--color-text-muted)',
                border: '1px solid var(--color-border)',
              }}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#E3B341]" />
              Gold Commander
            </button>

            <button
              onClick={() => setSelectedTheme('stealth')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0"
              style={{
                background: selectedTheme === 'stealth' ? '#1E2E20' : 'var(--color-bg-secondary)',
                color: selectedTheme === 'stealth' ? '#FFFFFF' : 'var(--color-text-muted)',
                border: '1px solid var(--color-border)',
              }}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#52D68A]" />
              Stealth Ops
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="btn-ghost flex-1 sm:flex-initial text-xs py-2 px-3 flex items-center justify-center gap-1.5"
              title="Salin Teks Doktrin"
            >
              {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
              <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="btn-primary flex-1 sm:flex-initial text-xs py-2 px-4 flex items-center justify-center gap-1.5"
            >
              <Download size={14} />
              <span>{downloading ? 'Memproses...' : 'Unduh Gambar (PNG)'}</span>
            </button>
          </div>
        </div>

        {/* Card Live Preview Container */}
        <div className="flex flex-col items-center justify-center py-2">
          <div className="flex items-center gap-1.5 mb-3 text-muted text-xs">
            <Eye size={13} />
            <span>PRATINJAU KARTU POTRET (HD READY)</span>
          </div>

          {/* Scaled Preview Wrapper for Mobile & Desktop */}
          <div
            className="w-full flex items-center justify-center p-2 sm:p-6 rounded-2xl overflow-x-auto"
            style={{
              background: 'radial-gradient(circle at center, rgba(12,23,16,0.85) 0%, rgba(7,17,12,0.98) 100%)',
              border: '1px solid var(--color-border)',
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)',
            }}
          >
            <div
              className="max-w-full overflow-x-auto pb-2"
              style={{
                boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(123,190,69,0.15)',
                borderRadius: 18,
                display: 'inline-block',
              }}
            >
              <DoctrineCard
                ref={cardRef}
                material={activeMaterial}
                theme={selectedTheme}
              />
            </div>
          </div>

          {/* Download & Share bottom CTA on mobile */}
          <div className="w-full mt-4 flex flex-col sm:flex-row gap-2.5 justify-center max-w-md">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2"
            >
              <Download size={16} />
              <span>{downloading ? 'Sedang Merender Gambar HD...' : `Unduh Kartu ${activeMaterial.name} (PNG)`}</span>
            </button>

            <button
              onClick={handleShare}
              disabled={downloading}
              className="btn-ghost w-full py-2.5 text-xs flex items-center justify-center gap-2"
            >
              <Share2 size={14} />
              <span>Bagikan Kartu</span>
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
