import React from 'react'

import BottomNavigation from '@/components/layout/BottomNavigation'

/**
 * Tabs Bottom Layout (Server Component)
 *
 * 하단 네비게이션이 있는 페이지들의 공통 레이아웃입니다.
 * BottomNavigation은 Client Component이지만, Layout은 Server Component로 유지합니다.
 */
export default function TabsBottomLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <main className="h-full w-full">{children}</main>
      <BottomNavigation />
    </div>
  )
}
