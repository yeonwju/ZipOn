import { redirect } from 'next/navigation'

/**
 * 루트 페이지 (Server Component)
 * 
 * 루트 경로(/)로 접근 시 홈 페이지(/home)로 리다이렉트합니다.
 */
export default function RootPage() {
  redirect('/home')
}
