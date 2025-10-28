import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HomeOn - 라이브',
  description: '실시간 매물 라이브 방송을 시청하세요',
}

/**
 * 라이브 방송 페이지 (Server Component)
 * 
 * 실시간 매물 라이브 방송 목록을 표시합니다.
 * 향후 API 연결 시 서버에서 라이브 방송 데이터를 가져와 표시합니다.
 */
export default function LivePage() {
  return (
    <section className="p-4">
      <h1 className="text-lg font-bold">라이브 화면</h1>
      <p className="mt-2 text-gray-600">실시간 매물 방송이 표시됩니다.</p>
    </section>
  )
}
