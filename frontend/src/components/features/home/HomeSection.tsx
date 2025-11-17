'use client'

import Link from 'next/link'

import SideScrollCardSection from '@/components/layout/SideScrollCardSection'
import { ListingItem, RecommendLiveItem } from '@/components/features/home'

interface HomeSectionProps {
  title: string
  href?: string
  children: React.ReactNode
}

/**
 * 홈 페이지 섹션 래퍼
 */
function HomeSection({ title, href, children }: HomeSectionProps) {
  const content = (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {href && (
          <Link href={href} className="text-sm font-medium text-blue-600 hover:text-blue-700">
            더보기 →
          </Link>
        )}
      </div>
      {children}
    </div>
  )

  return content
}

/**
 * 인기 라이브 방송 섹션
 */
export function PopularLiveSection() {
  // TODO: 실제 데이터로 교체
  const liveItems = Array.from({ length: 5 }, (_, i) => <RecommendLiveItem key={i} />)

  return (
    <HomeSection title="🔥 인기 라이브 방송" href="/live">
      <SideScrollCardSection>{liveItems}</SideScrollCardSection>
    </HomeSection>
  )
}

/**
 * 추천 매물 섹션
 */
export function RecommendedListingsSection() {
  // TODO: 실제 데이터로 교체
  const listingItems = Array.from({ length: 5 }, (_, i) => <ListingItem key={i} />)

  return (
    <HomeSection title="✨ AI 추천 매물" href="/listings">
      <SideScrollCardSection>{listingItems}</SideScrollCardSection>
    </HomeSection>
  )
}

