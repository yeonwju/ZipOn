import './globals.css'

import type { Metadata } from 'next'
import React from 'react'

import PwaProvider from '@/components/common/PwaProvider'
import InstallPrompt from '@/components/ui/InstallPrompt'

export const metadata: Metadata = {
  title: {
    template: '%s | ZipOn',
    default: 'ZipOn - 실시간 신뢰기반 임대/중개 플랫폼',
  },
  description: '실시간 라이브 방송으로 매물을 확인하세요',
  keywords: ['부동산', '매물', '라이브', '집', '아파트', '원룸'],
  authors: [{ name: 'ZipOn Team' }],
  openGraph: {
    title: 'ZipOn',
    description: '실시간 라이브 방송으로 매물을 확인하세요',
    type: 'website',
    locale: 'ko_KR',
  },
  manifest: '/manifest.webmanifest',
  themeColor: '#0ea5e9',
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/zipon-180.png', sizes: '180x180', type: 'image/png' }],
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning className="h-full">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#0ea5e9" />

        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />

        <link rel="apple-touch-icon" href="/icons/zipon-180.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ZipOn" />
      </head>
      <body
        suppressHydrationWarning
        className="h-full"
        style={{ fontFamily: 'Pretendard, system-ui, -apple-system, sans-serif' }}
      >
        <PwaProvider />
        {children}
        <InstallPrompt />
      </body>
    </html>
  )
}
