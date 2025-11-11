'use client'

import { useEffect } from 'react'

import { AuthGuard } from '@/components/auth'
import { Profile } from '@/components/features'
import ListingTaps from '@/components/features/mypage/ListingTaps'

/**
 * MyPage Client Component
 *
 * React Query로 사용자 정보를 관리합니다.
 * 하위 컴포넌트들은 useUser Hook으로 사용자 정보를 가져옵니다.
 *
 * 보호 레벨:
 * 1차: Middleware (토큰 체크)
 * 2차: AuthGuard (사용자 정보 확인, React Query 캐싱)
 */
export default function MyPageClient() {
  return (
    <AuthGuard>
      <MyPageContent />
    </AuthGuard>
  )
}

/**
 * MyPage 실제 컨텐츠
 *
 * 로그인 후 돌아왔을 때 뒤로가기 처리를 위한 플래그를 설정합니다.
 */
function MyPageContent() {
  useEffect(() => {
    // 로그인 후 돌아온 경우
    const fromPath = sessionStorage.getItem('auth_from_path')

    if (fromPath) {
      // onboard 페이지에서 확인할 수 있도록 플래그 유지
      // (제거하지 않음 - onboard에서 제거할 것)
      // 뒤로가기 시 onboard로 가면, onboard가 fromPath로 리다이렉트할 것임
    }
  }, [])

  return (
    <section className="flex w-full flex-col p-4 pb-16">
      <section>
        <Profile />
      </section>
      <ListingTaps className={'mt-4'} />
    </section>
  )
}
