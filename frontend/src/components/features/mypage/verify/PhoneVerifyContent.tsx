'use client'

import { useRouter } from 'next/navigation'

import { PhoneVerificationForm } from '@/components/features/mypage'

export default function PhoneVerifyContent() {
  const router = useRouter()

  // TODO: React Query useSuspenseQuery로 교체 (필요시)

  const handleComplete = () => {
    // 인증 완료 후 이전 페이지로 돌아가기
    router.back()
  }

  return <PhoneVerificationForm onComplete={handleComplete} />
}

