'use client'

import { useRouter } from 'next/navigation'

import { BusinessVerificationForm } from '@/components/features/mypage'
import { useUserStore } from '@/store/user'

export default function BusinessVerifyContent() {
  const router = useRouter()
  const user = useUserStore(state => state.user)

  // TODO: React Query useSuspenseQuery로 교체
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

