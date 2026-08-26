'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, BookOpen, Layers, EyeOff, Mic2 } from 'lucide-react'
import StudyMode from '@/components/memorization/StudyMode'
import FlashCard from '@/components/memorization/FlashCard'
import HiddenWordsExercise from '@/components/memorization/HiddenWordsExercise'
import type { Material } from '@/types'

type LatihanTab = 'belajar' | 'flashcard' | 'latihan'

const TABS: { value: LatihanTab; label: string; mobileLabel: string; icon: React.ElementType }[] = [
  { value: 'belajar', label: 'Mode Belajar', mobileLabel: 'Belajar', icon: BookOpen },
  { value: 'flashcard', label: 'Flashcard', mobileLabel: 'Flashcard', icon: Layers },
  { value: 'latihan', label: 'Kata Tersembunyi', mobileLabel: 'Rumpang', icon: EyeOff },
]

interface LatihanMaterialClientProps {
  material: Material
}

export default function LatihanMaterialClient({ material }: LatihanMaterialClientProps) {
  const [activeTab, setActiveTab] = useState<LatihanTab>('belajar')

  return (
    <div className="page-container max-w-3xl space-y-4 sm:space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
        <Link href="/latihan" className="flex items-center gap-1 hover:text-accent transition-colors">
          <ChevronLeft size={14} /> Latihan
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--color-text-primary)' }}>{material.name}</span>
      </div>

      {/* Header Card */}
      <div
        className="card p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        style={{
          background: `linear-gradient(135deg, var(--color-bg-card), ${material.color}18)`,
          borderColor: `${material.color}40`,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
              fontWeight: 800,
              letterSpacing: '0.06em',
              color: material.color,
              lineHeight: 1.2,
            }}
          >
            {material.name.toUpperCase()}
          </h1>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
            {material.itemCount} butir hafalan resmi TNI
          </p>
        </div>

        <Link
          href={`/setor/${material.id}`}
          className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 text-xs sm:text-sm py-2.5 px-4"
        >
          <Mic2 size={15} /> Setor Hafalan
        </Link>
      </div>

      {/* 3 Mode Tabs (Mobile-friendly) */}
      <div
        className="grid grid-cols-3 gap-1 p-1 rounded-xl"
        style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
      >
        {TABS.map(({ value, label, mobileLabel, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setActiveTab(value)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-1 rounded-lg transition-all text-center"
            style={{
              background: activeTab === value ? 'var(--color-bg-elevated)' : 'transparent',
              color: activeTab === value ? 'var(--color-accent)' : 'var(--color-text-muted)',
              border: activeTab === value ? '1px solid var(--color-border-accent)' : '1px solid transparent',
              fontSize: '0.78rem',
              fontWeight: activeTab === value ? 700 : 500,
              cursor: 'pointer',
            }}
          >
            <Icon size={14} className="flex-shrink-0" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{mobileLabel}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'belajar' && <StudyMode material={material} />}
        {activeTab === 'flashcard' && <FlashCard material={material} />}
        {activeTab === 'latihan' && <HiddenWordsExercise material={material} />}
      </div>
    </div>
  )
}
