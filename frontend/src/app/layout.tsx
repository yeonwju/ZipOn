import './globals.css'

import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: {
    template: '%s | HomeOn',
    default: 'HomeOn - 당신의 집을 찾아드립니다',
  },
  description: '실시간 라이브 방송으로 매물을 확인하세요',
  keywords: ['부동산', '매물', '라이브', '집', '아파트', '원룸'],
  authors: [{ name: 'HomeOn Team' }],
  openGraph: {
    title: 'HomeOn',
    description: '실시간 라이브 방송으로 매물을 확인하세요',
    type: 'website',
    locale: 'ko_KR',
  },
}

/**
 * 루트 레이아웃 (Server Component)
 *
 * 모든 페이지에 공통으로 적용되는 최상위 레이아웃입니다.
 * HTML 구조와 전역 메타데이터를 정의합니다.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning className={'h-full'}>
      <body suppressHydrationWarning className={'h-full'}>
        {children}
      </body>
    </html>
  )
}
