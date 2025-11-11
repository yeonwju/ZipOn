'use client'

import { useRouter } from 'next/navigation'

import { PhoneVerificationForm } from '@/components/features/mypage'
import { useUser } from '@/hooks/queries'

export default function PhoneVerifyContent() {
  const router = useRouter()

  const handleComplete = () => {
    // 인증 완료 후 이전 페이지로 돌아가기
    router.back()
  }

  return <PhoneVerificationForm onComplete={handleComplete} />
}
