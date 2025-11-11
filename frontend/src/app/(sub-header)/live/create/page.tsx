import LiveCreatePageClient from './LiveCreatePageClient'

/**
 * 라이브 방송 생성 페이지 (Server Component - Wrapper)
 *
 * Server Component는 껍데기 역할만 수행
 * 실제 인증 및 권한 체크는 LiveCreatePageClient에서 처리
 */
export default function LiveCreatePage() {
  return <LiveCreatePageClient />
}
