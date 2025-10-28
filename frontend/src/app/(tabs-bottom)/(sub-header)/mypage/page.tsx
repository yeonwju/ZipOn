import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HomeOn - 마이페이지',
  description: '내 정보와 활동 내역을 확인하세요',
}

/**
 * 마이페이지 (Server Component)
 *
 * 사용자의 프로필, 활동 내역, 설정 등을 표시합니다.
 * 향후 API 연결 시 서버에서 사용자 데이터를 가져와 표시합니다.
 */
export default function MyPage() {
  return (
    <section className="p-4">
      <h1 className="text-lg font-bold">마이페이지 화면</h1>
      <p className="mt-2 text-gray-600">내 정보가 표시됩니다.</p>
    </section>
  )
}
