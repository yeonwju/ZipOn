'use client'

import LiveItems from '@/components/live/LiveItems'
import FabDial from '@/components/ui/FabDial'
import { liveItems } from '@/data/LiveItem'
const metadata = liveItems
/**
 * 라이브 방송 페이지 (Server Component)
 *
 * 실시간 매물 라이브 방송 목록을 표시합니다.
 * 향후 API 연결 시 서버에서 라이브 방송 데이터를 가져와 표시합니다.
 */
export default function LivePage() {
  return (
    <section>
      <LiveItems items={metadata} />
      <FabDial />
    </section>
  )
}
