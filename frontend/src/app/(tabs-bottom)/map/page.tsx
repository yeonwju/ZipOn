import type { Metadata } from 'next'

import { ClientMapView } from '@/components/layout/map/ClientMapView'
import { BuildingData } from '@/data/Building'

export const metadata: Metadata = {
  title: 'HomeOn - 지도',
  description: '지도에서 매물을 확인하세요',
}

/**
 * 지도 페이지 메인 컴포넌트 (Server Component)
 *
 * 서버에서 초기 매물 데이터를 준비하고 클라이언트 컴포넌트에 전달합니다.
 * 향후 API 연결 시 이 부분만 수정하면 됩니다.
 */
export default function MapPage() {
  // 서버에서 초기 데이터 준비 (나중에 API로 교체)

  return <ClientMapView initialListings={BuildingData} />
}
