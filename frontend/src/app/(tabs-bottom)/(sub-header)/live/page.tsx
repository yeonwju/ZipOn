import { liveItems } from '@/data/LiveItem'

import LiveItems from '../../../../components/item/live/LiveItems'

const metadata = liveItems
/**
 * 라이브 방송 페이지 (Server Component)
 *
 * 실시간 매물 라이브 방송 목록을 표시합니다.
 * 향후 API 연결 시 서버에서 라이브 방송 데이터를 가져와 표시합니다.
 */
export default function LivePage() {
  return (
    <section className="py-2">
      <LiveItems items={metadata} />
    </section>
  )
}
