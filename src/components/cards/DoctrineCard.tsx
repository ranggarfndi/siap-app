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
    textColor: '#F8F9F5',
    subtextColor: '#B4BCAE',
    badgeBg: 'rgba(123, 190, 69, 0.18)',
    badgeBorder: 'rgba(123, 190, 69, 0.45)',
    badgeText: '#87CD4D',
    footerBg: 'rgba(7, 17, 12, 0.9)',
  },
  gold: {
    name: 'Gold Commander',
    bgGradient: 'linear-gradient(180deg, #0E0D07 0%, #17150A 40%, #1F1B0B 100%)',
    borderColor: '#A07E2A',
    innerBorderColor: 'rgba(201, 163, 61, 0.55)',
    accentColor: '#E3B341',
    goldColor: '#F5D061',
    textColor: '#FFFDF5',
    subtextColor: '#D2C8AF',
    badgeBg: 'rgba(201, 163, 61, 0.22)',
    badgeBorder: 'rgba(201, 163, 61, 0.55)',
    badgeText: '#F5D061',
    footerBg: 'rgba(14, 13, 7, 0.9)',
  },
  stealth: {
    name: 'Stealth Ops',
    bgGradient: 'linear-gradient(180deg, #050806 0%, #090E0B 40%, #0D1410 100%)',
    borderColor: '#1E2E20',
    innerBorderColor: 'rgba(82, 214, 138, 0.3)',
    accentColor: '#52D68A',
    goldColor: '#C9A33D',
    textColor: '#FFFFFF',
    subtextColor: '#9DB09D',
    badgeBg: 'rgba(82, 214, 138, 0.15)',
    badgeBorder: 'rgba(82, 214, 138, 0.4)',
    badgeText: '#52D68A',
    footerBg: 'rgba(5, 8, 6, 0.92)',
  },
}

const DoctrineCard = forwardRef<HTMLDivElement, DoctrineCardProps>(
  ({ material, theme = 'tactical' }, ref) => {
    const t = THEME_STYLES[theme] ?? THEME_STYLES.tactical

    // Font size scaling based on item count for optimal readable layout
    const itemCount = material.items.length
    const itemFontSize = itemCount <= 5 ? 16 : itemCount <= 7 ? 14.5 : 13.8
    const itemPadding = itemCount <= 5 ? '10px 14px' : itemCount <= 7 ? '9px 12px' : '7.5px 11px'

    return (
      <div
        ref={ref}
        id="doctrine-card-canvas"
        style={{
          width: 620,
          minHeight: 1020,
          background: t.bgGradient,
          color: t.textColor,
          fontFamily: 'var(--font-sans)',
          position: 'relative',
          padding: '30px 26px',
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
            border: `1.8px solid ${t.borderColor}`,
            borderRadius: 18,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 15,
            border: `1.2px solid ${t.innerBorderColor}`,
            borderRadius: 14,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Tactical Corner Crosshairs */}
        <span style={{ position: 'absolute', top: 20, left: 20, color: t.accentColor, fontSize: 14, fontFamily: 'monospace', zIndex: 2, fontWeight: 'bold' }}>+</span>
        <span style={{ position: 'absolute', top: 20, right: 20, color: t.accentColor, fontSize: 14, fontFamily: 'monospace', zIndex: 2, fontWeight: 'bold' }}>+</span>
        <span style={{ position: 'absolute', bottom: 20, left: 20, color: t.accentColor, fontSize: 14, fontFamily: 'monospace', zIndex: 2, fontWeight: 'bold' }}>+</span>
        <span style={{ position: 'absolute', bottom: 20, right: 20, color: t.accentColor, fontSize: 14, fontFamily: 'monospace', zIndex: 2, fontWeight: 'bold' }}>+</span>

        {/* Tactical Watermark Grid Background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              radial-gradient(circle at 50% 15%, rgba(123, 190, 69, 0.09) 0%, transparent 65%),
              linear-gradient(rgba(123, 190, 69, 0.035) 1px, transparent 1px),
              linear-gradient(90deg, rgba(123, 190, 69, 0.035) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 28px 28px, 28px 28px',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Top Header Section */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', marginBottom: 16 }}>
          {/* Top Rank Chevrons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginBottom: 8 }}>
            <span style={{ color: t.goldColor, fontSize: 12, letterSpacing: 5, fontWeight: 900 }}>▲ ▲ ▲</span>
          </div>

          {/* Logo Badge & Headings */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 8 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 12,
                overflow: 'hidden',
                background: '#07110C',
                border: `1.8px solid ${t.accentColor}`,
                boxShadow: `0 0 16px ${t.accentColor}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Image
                src="/siap-logo.png"
                alt="Logo SIAP"
                width={50}
                height={50}
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div style={{ textAlign: 'left' }}>
              <p
                style={{
                  fontSize: 12.5,
                  fontWeight: 800,
                  letterSpacing: '0.18em',
                  color: t.goldColor,
                  textTransform: 'uppercase',
                  margin: 0,
                  lineHeight: 1.25,
                }}
              >
                TENTARA NASIONAL INDONESIA
              </p>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  color: t.subtextColor,
                  textTransform: 'uppercase',
                  margin: 0,
                  lineHeight: 1.25,
                }}
              >
                PEDOMAN DOKTRIN KEPRAJURITAN
              </p>
            </div>
          </div>

          {/* Doctrine Main Title */}
          <div style={{ margin: '10px 0 6px' }}>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 38,
                fontWeight: 900,
                letterSpacing: '0.07em',
                color: t.accentColor,
                textTransform: 'uppercase',
                margin: 0,
                lineHeight: 1,
                textShadow: `0 3px 12px rgba(0,0,0,0.9), 0 0 25px ${t.accentColor}45`,
              }}
            >
              {material.name}
            </h1>
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: t.subtextColor,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginTop: 5,
                marginBottom: 0,
              }}
            >
              {material.itemCount} BUTIR PEDOMAN UTAMA
            </p>
          </div>

          {/* Decorative Divider with Stars */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '10px auto 0', maxWidth: 400 }}>
            <div style={{ flex: 1, height: 1.2, background: `linear-gradient(90deg, transparent, ${t.goldColor})` }} />
            <span style={{ color: t.goldColor, fontSize: 13, letterSpacing: 2 }}>★ ★ ★</span>
            <div style={{ flex: 1, height: 1.2, background: `linear-gradient(90deg, ${t.goldColor}, transparent)` }} />
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
            gap: itemCount <= 5 ? 10 : 7.5,
            padding: '0 6px',
          }}
        >
          {material.items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                background: 'rgba(7, 17, 12, 0.55)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 10,
                padding: itemPadding,
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              {/* Number Badge */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: t.badgeBg,
                  border: `1.2px solid ${t.badgeBorder}`,
                  color: t.badgeText,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontSize: 16,
                  fontWeight: 900,
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {item.number}
              </div>

              {/* Text with Larger Font Size */}
              <p
                style={{
                  fontSize: itemFontSize,
                  lineHeight: 1.55,
                  color: t.textColor,
                  margin: 0,
                  fontWeight: 450,
                  letterSpacing: '0.01em',
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
            marginTop: 16,
            background: t.footerBg,
            border: `1px solid ${t.innerBorderColor}`,
            borderRadius: 12,
            padding: '10px 16px',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          {/* Motto */}
          <p
            style={{
              fontSize: 10.5,
              fontWeight: 800,
              letterSpacing: '0.15em',
              color: t.goldColor,
              textTransform: 'uppercase',
              margin: '0 0 4px',
              lineHeight: 1.25,
            }}
          >
            &ldquo;DISIPLIN ADALAH NAFASKU &bull; KEHORMATAN ADALAH SEGALA-GALANYA&rdquo;
          </p>

          {/* Subfooter */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 5, paddingTop: 5, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: 9, color: t.subtextColor, letterSpacing: '0.04em', fontWeight: 500 }}>
              SIAP &bull; Sistem Interaktif Asah Prajurit
            </span>
            <span style={{ fontSize: 9, color: t.accentColor, fontWeight: 800, letterSpacing: '0.08em' }}>
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
