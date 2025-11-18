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
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
            <p className="text-sm text-gray-600">로딩 중...</p>
          </div>
        </div>
      }
    >
      <OnboardContent />
    </Suspense>
  )
}
