import { Suspense } from 'react'

import PhoneVerifyContent from '@/components/features/mypage/verify/PhoneVerifyContent'
import { VerifyFormSkeleton } from '@/components/skeleton/verify'

/**
 * 휴대폰 인증 페이지
 *
 * 본인 확인을 위한 휴대폰 인증 절차를 진행합니다.
 */
export default function PhoneVerifyPage() {
  return (
    <Suspense fallback={<VerifyFormSkeleton />}>
      <PhoneVerifyContent />
    </Suspense>
  )
}
