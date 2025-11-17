import { cookies } from 'next/headers'

import OnAirPageClient from './OnAirPageClient'

/**
 * 라이브 방송 페이지 (Server Component - Wrapper)
 * 
 * Server Component에서 쿠키를 읽어서 클라이언트로 전달
 * 실제 인증은 OnAirPageClient의 AuthGuard에서 처리
 */
export default async function OnAirPage() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('AT')?.value || null

  return <OnAirPageClient authToken={authToken} />
}
