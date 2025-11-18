import { ClientMapView } from '@/components/layout/map/ClientMapView'
import { getListingsMap } from '@/services/listingService'

export const dynamic = 'force-dynamic'

/**
 * 지도 페이지 메인 컴포넌트 (Server Component)
 *
 * 서버에서 초기 매물 데이터를 준비하고 클라이언트 컴포넌트에 전달합니다.
 * 데이터 소스는 `listingService.ts`에서 중앙 관리됩니다.
 *
 * **데이터 소스 변경 방법:**
 * `src/services/listingService.ts`의 `getListings()` 함수만 수정하면 됩니다.
 */
export default async function MapPage() {
  const initialListings = await getListingsMap()

  return <ClientMapView initialListings={initialListings} />
}
