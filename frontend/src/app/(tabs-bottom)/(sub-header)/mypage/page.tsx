import MyPageClient from '@/components/features/mypage/page/MyPageClient'

/**
 * 마이페이지 (Server Component - Wrapper)
 *
 * Server Component는 껍데기 역할만 수행
 * 실제 인증은 MyPageClient의 AuthGuard에서 처리
 */
export default function MyPage() {
  return <MyPageClient />
}
