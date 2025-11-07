import PageTransition from '@/components/common/PageTransition'
import React from 'react'

/**
 * Sub Header Template
 *
 * 페이지 전환 애니메이션을 적용합니다.
 * template.tsx는 페이지 전환마다 새로 마운트되어 애니메이션이 작동합니다.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>
}
