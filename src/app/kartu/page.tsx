'use client'

import { useState, useRef, useEffect } from 'react'
import html2canvas from 'html2canvas'
import AppLayout from '@/components/layout/AppLayout'
import DoctrineCard, { type CardTheme } from '@/components/cards/DoctrineCard'
import materials from '@/data/materials'
import { Download, Check, Palette, Share2, Sparkles, Copy, Eye, Shield, Scroll, ListChecks } from 'lucide-react'

export default function KartuDoktrinPage() {
  const [selectedMaterialId, setSelectedMaterialId] = useState(materials[0].id)
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>('tactical')
  const [downloading, setDownloading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [scale, setScale] = useState(0.55)

  const cardRef = useRef<HTMLDivElement>(null)
  const previewContainerRef = useRef<HTMLDivElement>(null)

  const activeMaterial = materials.find((m) => m.id === selectedMaterialId) ?? materials[0]

  // Automatically recalculate precise scale to fit any phone or desktop screen perfectly
  useEffect(() => {
    function updateScale() {
      if (previewContainerRef.current) {
        // Container available width minus inner padding (16px)
        const containerWidth = previewContainerRef.current.clientWidth - 16
        const cardWidth = 620 // Native card render width
        const calculatedScale = Math.min(1, Math.max(0.38, containerWidth / cardWidth))
        setScale(calculatedScale)
      }
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    // Small timeout to guarantee DOM geometry is fully mounted
    const t = setTimeout(updateScale, 100)
    return () => {
      window.removeEventListener('resize', updateScale)
      clearTimeout(t)
    }
  }, [selectedMaterialId])

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
        // User cancelled share
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

  const materialIcons = {
    'sapta-marga': Shield,
    'sumpah-prajurit': Scroll,
    '8-wajib-tni': ListChecks,
  }

  const nativeCardHeight = 1020

  return (
    <AppLayout>
      <div className="page-container max-w-3xl space-y-3.5 sm:space-y-5 px-3 sm:px-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={16} style={{ color: 'var(--color-gold)' }} />
            <p className="section-label text-[0.68rem] sm:text-xs">KOLEKSI DOKTRIN PRAJURIT</p>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.35rem, 4.5vw, 2rem)',
              fontWeight: 800,
              letterSpacing: '0.05em',
              color: 'var(--color-text-primary)',
              lineHeight: 1.15,
            }}
          >
            KARTU DOKTRIN TNI
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.78rem', marginTop: '0.2rem' }}>
            Kartu potret HD siap simpan untuk wallpaper smartphone, poster hafalan saku, atau media cetak.
          </p>
        </div>

        {/* Material Selection Tabs (Clean mobile segmented bar) */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
          {materials.map((m) => {
            const isSelected = m.id === selectedMaterialId
            const Icon = materialIcons[m.id as keyof typeof materialIcons] ?? Shield
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMaterialId(m.id)}
                className="py-2 px-1 text-center rounded-lg transition-all flex flex-col items-center justify-center gap-0.5 active:scale-95"
                style={{
                  background: isSelected ? 'var(--color-bg-secondary)' : 'transparent',
                  color: isSelected ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  border: isSelected ? '1px solid rgba(123,190,69,0.35)' : '1px solid transparent',
                  boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.35)' : 'none',
                }}
              >
                <Icon size={15} style={{ color: isSelected ? 'var(--color-accent)' : 'var(--color-text-muted)' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: isSelected ? 800 : 600 }}>{m.name}</span>
                <span style={{ fontSize: '0.6rem', color: isSelected ? 'var(--color-gold)' : 'var(--color-text-muted)', opacity: 0.85 }}>
                  {m.itemCount} Butir
                </span>
              </button>
            )
          })}
        </div>

        {/* Theme Selector (3 Equal Pill Tabs on Mobile) */}
        <div className="card p-2.5 sm:p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-secondary">
              <Palette size={13} style={{ color: 'var(--color-gold)' }} />
              <span>PILIH TEMA KARTU:</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => setSelectedTheme('tactical')}
              className="py-2 px-1 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
              style={{
                background: selectedTheme === 'tactical' ? '#485B2C' : 'var(--color-bg-secondary)',
                color: selectedTheme === 'tactical' ? '#FFFFFF' : 'var(--color-text-muted)',
                border: selectedTheme === 'tactical' ? '1px solid #7BBE45' : '1px solid var(--color-border)',
                boxShadow: selectedTheme === 'tactical' ? '0 2px 10px rgba(123,190,69,0.2)' : 'none',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-[#7BBE45]" />
              <span className="text-[0.7rem] sm:text-xs">Tactical</span>
            </button>

            <button
              onClick={() => setSelectedTheme('gold')}
              className="py-2 px-1 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
              style={{
                background: selectedTheme === 'gold' ? '#8C6F23' : 'var(--color-bg-secondary)',
                color: selectedTheme === 'gold' ? '#FAF7EE' : 'var(--color-text-muted)',
                border: selectedTheme === 'gold' ? '1px solid #E3B341' : '1px solid var(--color-border)',
                boxShadow: selectedTheme === 'gold' ? '0 2px 10px rgba(227,179,65,0.2)' : 'none',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-[#E3B341]" />
              <span className="text-[0.7rem] sm:text-xs">Gold</span>
            </button>

            <button
              onClick={() => setSelectedTheme('stealth')}
              className="py-2 px-1 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
              style={{
                background: selectedTheme === 'stealth' ? '#1E2E20' : 'var(--color-bg-secondary)',
                color: selectedTheme === 'stealth' ? '#FFFFFF' : 'var(--color-text-muted)',
                border: selectedTheme === 'stealth' ? '1px solid #52D68A' : '1px solid var(--color-border)',
                boxShadow: selectedTheme === 'stealth' ? '0 2px 10px rgba(82,214,138,0.2)' : 'none',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-[#52D68A]" />
              <span className="text-[0.7rem] sm:text-xs">Stealth</span>
            </button>
          </div>
        </div>

        {/* Card Showcase Frame (Auto-scaled dynamically on mobile) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs px-1 text-muted">
            <div className="flex items-center gap-1">
              <Eye size={13} style={{ color: 'var(--color-accent)' }} />
              <span className="font-semibold text-[0.7rem]">PRATINJAU KARTU</span>
            </div>
            <span className="text-[0.65rem] text-muted">Format Potret HD</span>
          </div>

          <div
            ref={previewContainerRef}
            className="w-full flex items-start justify-center p-2 sm:p-5 rounded-2xl overflow-hidden"
            style={{
              background: 'radial-gradient(circle at center, rgba(12,23,16,0.92) 0%, rgba(5,10,7,0.98) 100%)',
              border: '1px solid var(--color-border-accent)',
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.7), 0 8px 30px rgba(0,0,0,0.5)',
              height: Math.round(nativeCardHeight * scale) + 24,
            }}
          >
            <div
              style={{
                width: 620,
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                boxShadow: '0 20px 60px rgba(0,0,0,0.9), 0 0 35px rgba(123,190,69,0.18)',
                borderRadius: 18,
                flexShrink: 0,
              }}
            >
              <DoctrineCard
                ref={cardRef}
                material={activeMaterial}
                theme={selectedTheme}
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions Suite */}
        <div className="space-y-2 pt-1 pb-4">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="btn-primary w-full py-3 sm:py-3.5 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            style={{
              boxShadow: '0 4px 20px rgba(123,190,69,0.25)',
            }}
          >
            <Download size={16} />
            <span>{downloading ? 'Sedang Merender Gambar HD...' : `Unduh Gambar Kartu ${activeMaterial.name} (PNG HD)`}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopyText}
              className="btn-ghost py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95"
            >
              {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
              <span>{copied ? 'Teks Tersalin!' : 'Salin Teks Doktrin'}</span>
            </button>

            <button
              onClick={handleShare}
              disabled={downloading}
              className="btn-ghost py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95"
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
