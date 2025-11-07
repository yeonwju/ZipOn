'use client'

import { useRouter } from 'next/navigation'

import { BusinessVerificationForm } from '@/components/features/mypage'
import { useUserStore } from '@/store/user'

/**
 * 사업자 인증 페이지
 *
 * 중개업자 등록을 위한 사업자 인증 절차를 진행합니다.
 */
export default function BusinessVerifyPage() {
  const router = useRouter()
  const user = useUserStore(state => state.user)
  // TODO: 실제 사용자 정보 가져오기
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
