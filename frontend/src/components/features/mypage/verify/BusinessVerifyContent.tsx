'use client'

import { useRouter } from 'next/navigation'

import { BusinessVerificationForm } from '@/components/features/mypage'
import { useUser } from '@/hooks/queries/useUser'

export default function BusinessVerifyContent() {
  const router = useRouter()
  const { data: user } = useUser()

  const userName = user?.name
  const userBirthDate = user?.birth

  const handleComplete = () => {
    // 인증 완료 후 마이페이지로 이동
    router.push('/mypage')
  }

  return (
    <BusinessVerificationForm
      userName={userName}
      userBirthDate={userBirthDate}
      onComplete={handleComplete}
    />
  )
}

