import LikePageClient from './LikePageClient'

/**
 * 찜한 매물 페이지 (Server Component - Wrapper)
 *
 * Server Component는 껍데기 역할만 수행
 * 실제 인증은 LikePageClient의 AuthGuard에서 처리
 */
export default function LikePage() {
  return <LikePageClient />
}
