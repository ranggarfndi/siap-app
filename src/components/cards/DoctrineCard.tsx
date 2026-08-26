'use client'

import React, { forwardRef } from 'react'
import Image from 'next/image'
import type { Material } from '@/types'

export type CardTheme = 'tactical' | 'gold' | 'stealth'

interface DoctrineCardProps {
  material: Material
  theme?: CardTheme
}

const THEME_STYLES: Record<
  CardTheme,
  {
    name: string
    bgGradient: string
    borderColor: string
    innerBorderColor: string
    accentColor: string
    goldColor: string
    textColor: string
    subtextColor: string
    badgeBg: string
    badgeBorder: string
    badgeText: string
    footerBg: string
  }
> = {
  tactical: {
    name: 'Tactical Army',
    bgGradient: 'linear-gradient(180deg, #07110C 0%, #0C1710 40%, #0F1F14 100%)',
    borderColor: '#485B2C',
    innerBorderColor: 'rgba(123, 190, 69, 0.4)',
    accentColor: '#7BBE45',
    goldColor: '#C9A33D',
    textColor: '#F3F3EB',
    subtextColor: '#A5ACA2',
    badgeBg: 'rgba(123, 190, 69, 0.15)',
    badgeBorder: 'rgba(123, 190, 69, 0.4)',
    badgeText: '#7BBE45',
    footerBg: 'rgba(7, 17, 12, 0.85)',
  },
  gold: {
    name: 'Gold Commander',
    bgGradient: 'linear-gradient(180deg, #0E0D07 0%, #17150A 40%, #1F1B0B 100%)',
    borderColor: '#A07E2A',
    innerBorderColor: 'rgba(201, 163, 61, 0.5)',
    accentColor: '#E3B341',
    goldColor: '#F5D061',
    textColor: '#FAF7EE',
    subtextColor: '#C7BEA5',
    badgeBg: 'rgba(201, 163, 61, 0.18)',
    badgeBorder: 'rgba(201, 163, 61, 0.5)',
    badgeText: '#F5D061',
    footerBg: 'rgba(14, 13, 7, 0.85)',
  },
  stealth: {
    name: 'Stealth Ops',
    bgGradient: 'linear-gradient(180deg, #050806 0%, #090E0B 40%, #0D1410 100%)',
    borderColor: '#1E2E20',
    innerBorderColor: 'rgba(123, 190, 69, 0.25)',
    accentColor: '#52D68A',
    goldColor: '#C9A33D',
    textColor: '#FFFFFF',
    subtextColor: '#8E9B8E',
    badgeBg: 'rgba(82, 214, 138, 0.12)',
    badgeBorder: 'rgba(82, 214, 138, 0.35)',
    badgeText: '#52D68A',
    footerBg: 'rgba(5, 8, 6, 0.9)',
  },
}

const DoctrineCard = forwardRef<HTMLDivElement, DoctrineCardProps>(
  ({ material, theme = 'tactical' }, ref) => {
    const t = THEME_STYLES[theme] ?? THEME_STYLES.tactical

    return (
      <div
        ref={ref}
        id="doctrine-card-canvas"
        style={{
          width: 580,
          minHeight: 960,
          background: t.bgGradient,
          color: t.textColor,
          fontFamily: 'var(--font-sans)',
          position: 'relative',
          padding: '28px 24px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Outer & Inner Military Frame */}
        <div
          style={{
            position: 'absolute',
            inset: 10,
            border: `1.5px solid ${t.borderColor}`,
            borderRadius: 16,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 14,
            border: `1px solid ${t.innerBorderColor}`,
            borderRadius: 12,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Tactical Corner Crosshairs */}
        <span style={{ position: 'absolute', top: 18, left: 18, color: t.accentColor, fontSize: 13, fontFamily: 'monospace', zIndex: 2 }}>+</span>
        <span style={{ position: 'absolute', top: 18, right: 18, color: t.accentColor, fontSize: 13, fontFamily: 'monospace', zIndex: 2 }}>+</span>
        <span style={{ position: 'absolute', bottom: 18, left: 18, color: t.accentColor, fontSize: 13, fontFamily: 'monospace', zIndex: 2 }}>+</span>
        <span style={{ position: 'absolute', bottom: 18, right: 18, color: t.accentColor, fontSize: 13, fontFamily: 'monospace', zIndex: 2 }}>+</span>

        {/* Tactical Watermark Grid Background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              radial-gradient(circle at 50% 20%, rgba(123, 190, 69, 0.08) 0%, transparent 60%),
              linear-gradient(rgba(123, 190, 69, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(123, 190, 69, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 28px 28px, 28px 28px',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Top Header Section */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', marginBottom: 16 }}>
          {/* Top Rank Chevrons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 6 }}>
            <span style={{ color: t.goldColor, fontSize: 11, letterSpacing: 4, fontWeight: 800 }}>▲ ▲ ▲</span>
          </div>

          {/* Logo Badge & Headings */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 10,
                overflow: 'hidden',
                background: '#07110C',
                border: `1.5px solid ${t.accentColor}`,
                boxShadow: `0 0 12px ${t.accentColor}33`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Image
                src="/siap-logo.png"
                alt="Logo SIAP"
                width={44}
                height={44}
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div style={{ textAlign: 'left' }}>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  color: t.goldColor,
                  textTransform: 'uppercase',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                TENTARA NASIONAL INDONESIA
              </p>
              <p
                style={{
                  fontSize: 8.5,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  color: t.subtextColor,
                  textTransform: 'uppercase',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                PEDOMAN DOKTRIN KEPRAJURITAN
              </p>
            </div>
          </div>

          {/* Doctrine Main Title */}
          <div style={{ margin: '8px 0 6px' }}>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 34,
                fontWeight: 900,
                letterSpacing: '0.08em',
                color: t.accentColor,
                textTransform: 'uppercase',
                margin: 0,
                lineHeight: 1,
                textShadow: `0 2px 10px rgba(0,0,0,0.8), 0 0 20px ${t.accentColor}40`,
              }}
            >
              {material.name}
            </h1>
            <p
              style={{
                fontSize: 9.5,
                color: t.subtextColor,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginTop: 4,
                marginBottom: 0,
              }}
            >
              {material.itemCount} BUTIR PEDOMAN UTAMA
            </p>
          </div>

          {/* Decorative Divider with Star */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '8px auto 0', maxWidth: 360 }}>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${t.goldColor})` }} />
            <span style={{ color: t.goldColor, fontSize: 11 }}>★ ★ ★</span>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${t.goldColor}, transparent)` }} />
          </div>
        </div>

        {/* Doctrine Content Items */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            gap: material.items.length > 7 ? 6 : 8,
            padding: '0 8px',
          }}
        >
          {material.items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                background: 'rgba(7, 17, 12, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 8,
                padding: material.items.length > 7 ? '6px 10px' : '8px 12px',
              }}
            >
              {/* Number Badge */}
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  background: t.badgeBg,
                  border: `1px solid ${t.badgeBorder}`,
                  color: t.badgeText,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontSize: 14,
                  fontWeight: 800,
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {item.number}
              </div>

              {/* Text */}
              <p
                style={{
                  fontSize: material.items.length > 7 ? 10.5 : 11.5,
                  lineHeight: 1.48,
                  color: t.textColor,
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* Card Footer Section */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            marginTop: 14,
            background: t.footerBg,
            border: `1px solid ${t.innerBorderColor}`,
            borderRadius: 10,
            padding: '8px 14px',
            textAlign: 'center',
          }}
        >
          {/* Motto */}
          <p
            style={{
              fontSize: 8.5,
              fontWeight: 800,
              letterSpacing: '0.14em',
              color: t.goldColor,
              textTransform: 'uppercase',
              margin: '0 0 3px',
              lineHeight: 1.2,
            }}
          >
            &ldquo;DISIPLIN ADALAH NAFASKU &bull; KEHORMATAN ADALAH SEGALA-GALANYA&rdquo;
          </p>

          {/* Subfooter */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: 7.5, color: t.subtextColor, letterSpacing: '0.04em' }}>
              SIAP &bull; Sistem Interaktif Asah Prajurit
            </span>
            <span style={{ fontSize: 7.5, color: t.accentColor, fontWeight: 700, letterSpacing: '0.06em' }}>
              LATIH &bull; HAFALKAN &bull; TEPATKAN
            </span>
          </div>
        </div>
      </div>
    )
  }
)

DoctrineCard.displayName = 'DoctrineCard'

export default DoctrineCard
