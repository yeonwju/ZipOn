'use client'

import { useRouter } from 'next/navigation'

import { PhoneVerificationForm } from '@/components/features/mypage'

/**
 * 휴대폰 인증 페이지
 *
 * 본인 확인을 위한 휴대폰 인증 절차를 진행합니다.
 */
export default function PhoneVerifyPage() {
  const router = useRouter()

  const handleComplete = () => {
    // 인증 완료 후 이전 페이지로 돌아가기
    router.back()
  }

  return <PhoneVerificationForm onComplete={handleComplete} />
}
