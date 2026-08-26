import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SIAP — Sistem Interaktif Asah Prajurit',
  description:
    'SIAP (Sistem Interaktif Asah Prajurit) — Platform latihan dan evaluasi hafalan interaktif doktrin keprajuritan TNI: Sapta Marga, Sumpah Prajurit, dan 8 Wajib TNI. Latih. Hafalkan. Tepatkan.',
  keywords: [
    'SIAP',
    'Sistem Interaktif Asah Prajurit',
    'hafalan',
    'doktrin TNI',
    'Sapta Marga',
    'Sumpah Prajurit',
    '8 Wajib TNI',
    'TNI',
    'prajurit',
  ],
  icons: {
    icon: [
      { url: '/siap-logo.png', sizes: 'any' },
      { url: '/siap-logo.jpg', type: 'image/jpeg' },
    ],
    shortcut: '/siap-logo.png',
    apple: '/siap-logo.png',
  },
  openGraph: {
    title: 'SIAP — Sistem Interaktif Asah Prajurit',
    description: 'Sistem Interaktif Asah Prajurit — Latih. Hafalkan. Tepatkan.',
    type: 'website',
    images: [{ url: '/siap-logo.jpg', width: 800, height: 800, alt: 'SIAP — Sistem Interaktif Asah Prajurit' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="dark">
      <head>
        <title>SIAP — Sistem Interaktif Asah Prajurit</title>
        <link rel="icon" href="/siap-logo.png" sizes="any" />
        <link rel="apple-touch-icon" href="/siap-logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
