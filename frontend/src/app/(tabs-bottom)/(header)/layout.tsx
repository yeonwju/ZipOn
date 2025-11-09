import React from 'react'

import MainHeader from '@/components/layout/header/MainHeader'

/**
 * Main Header Layout (Server Component)
 *
 * 홈 페이지에서 사용하는 메인 헤더 레이아웃입니다.
 * MainHeader와 컨텐츠 영역을 함께 구성합니다.
 */
export default function HeaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <MainHeader />
      <main className="pt-8.5 pb-13">{children}</main>
    </div>
  )
}
