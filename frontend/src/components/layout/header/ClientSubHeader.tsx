'use client'

import { usePathname } from 'next/navigation'

import SubHeader from './SubHeader'

/**
 * SubHeader 클라이언트 래퍼
 * 
 * usePathname Hook을 사용하기 위한 클라이언트 컴포넌트입니다.
 * Layout은 Server Component로 유지하고 이 부분만 Client로 분리했습니다.
 */
export function ClientSubHeader() {
  const pathname = usePathname()
  return <SubHeader pathname={pathname} />
}

