export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'

import MyPageClient from '@/components/features/mypage/page/MyPageClient'
import { fetchCurrentUser } from '@/services/authService'

export const dynamic = 'force-dynamic'

/**
 * 마이페이지 (Server Component)
 *
 * 사용자의 프로필, 활동 내역, 설정 등을 표시합니다.
 */
export default async function MyPage() {
  const user = await fetchCurrentUser()

  // 사용자 정보가 없으면 onboard로 리다이렉트
  if (!user) {
    redirect('/onboard')
  }

  return <MyPageClient user={user} />
}
