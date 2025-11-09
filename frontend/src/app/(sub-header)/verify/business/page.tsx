import { Suspense } from 'react'

import BusinessVerifyContent from '@/components/features/mypage/verify/BusinessVerifyContent'
import { VerifyFormSkeleton } from '@/components/skeleton/verify'

/**
 * 사업자 인증 페이지
 *
 * 중개업자 등록을 위한 사업자 인증 절차를 진행합니다.
 */
export default function BusinessVerifyPage() {
  return (
    <Suspense fallback={<VerifyFormSkeleton />}>
      <BusinessVerifyContent />
    </Suspense>
  )
}
