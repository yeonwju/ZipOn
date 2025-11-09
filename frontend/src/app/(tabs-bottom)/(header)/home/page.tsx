import type { Metadata } from 'next'

import { BuildingTypeQuickFilter, ListingItem, RecommendLiveItem } from '@/components/features/home'
import SideScrollCardSection from '@/components/layout/SideScrollCardSection'

export const metadata: Metadata = {
  title: 'HomeOn - 홈',
  description: '실시간 인기 방송과 추천 매물을 확인하세요',
}

export const dynamic = 'force-dynamic'

/**
 * 홈 페이지 (Server Component)
 *
 * 실시간 인기 방송, 추천 매물, 경매 임박 매물을 표시합니다.
 * 향후 API 연결 시 서버에서 데이터를 페칭하여 표시합니다.
 */
export default function HomePage() {
  return (
    <section className="flex flex-col gap-5 p-2">
      {/* 매물 유형별 바로보기 */}
      <BuildingTypeQuickFilter />
      <SideScrollCardSection title="실시간 인기 방송" cardMinWidth="220px">
        <RecommendLiveItem />
        <RecommendLiveItem />
        <RecommendLiveItem />
        <RecommendLiveItem />
        <RecommendLiveItem />
        <RecommendLiveItem />
        <RecommendLiveItem />
        <RecommendLiveItem />
      </SideScrollCardSection>

      <SideScrollCardSection title="추천 매물">
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
      </SideScrollCardSection>

      <SideScrollCardSection title="경매 임박 매물">
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
      </SideScrollCardSection>
    </section>
  )
}
