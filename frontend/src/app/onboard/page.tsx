import { Suspense } from 'react'

import OnboardContent from './OnboardContent'

/**
 * Onboard Page (Server Component)
 *
 * 로그인 페이지입니다.
 * useSearchParams를 사용하는 OnboardContent는 Client Component로 분리했습니다.
 */
export default function OnboardPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <OnboardContent />
    </Suspense>
  )
}
