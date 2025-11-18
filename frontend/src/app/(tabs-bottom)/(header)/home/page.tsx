import type { Metadata } from 'next'

import FirebaseInit from '@/components/common/FirebaseInit'
import { BuildingTypeQuickFilter, HeroSection } from '@/components/features/home'

export const metadata: Metadata = {
  title: 'HomeOn - 홈',
  description: 'AI 검증 기반 실시간 부동산 안심 거래 플랫폼',
}

export const dynamic = 'force-dynamic'

/**
 * 홈 페이지 (Server Component)
 *
 * AI 검증 기반 실시간 부동산 안심 거래 플랫폼의 메인 화면입니다.
 * - 히어로 섹션: 서비스 소개 및 AI 로봇
 * - 매물 유형별 빠른 필터
 * - 인기 라이브 방송
 * - AI 추천 매물
 */
export default function HomePage() {
  return (
    <>
      <FirebaseInit />

      <section className="flex flex-col gap-6 p-4 pb-6">
        {/* 히어로 섹션: AI 로봇과 서비스 소개 */}
        <BuildingTypeQuickFilter />
        <HeroSection />
      </section>
    </>
  )
}
