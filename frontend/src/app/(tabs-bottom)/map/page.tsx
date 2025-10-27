'use client'

import KakaoMapLoader from '@/components/layout/KakaoMapLoader'

export default function MapPage() {
  return (
    <section className="fixed inset-0 top-0 bottom-[73px] z-0 h-screen w-full">
      <KakaoMapLoader />
    </section>
  )
}
