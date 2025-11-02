import React from 'react'

import { ClientSubHeader } from '@/components/layout/header/ClientSubHeader'

/**
 * Sub Header Layout (Server Component)
 *
 * 매물 상세 페이지에서 사용하는 서브 헤더 레이아웃입니다.
 * SubHeader의 pathname 처리는 ClientSubHeader에서 담당.
 */
export default function SubHeaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <ClientSubHeader />
      <main className="pt-11">{children}</main>
    </div>
  )
}
