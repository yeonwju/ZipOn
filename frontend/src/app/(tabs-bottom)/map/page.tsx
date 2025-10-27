'use client'

import { usePathname } from 'next/navigation'

import KakaoMapLoader from '@/components/layout/KakaoMapLoader'

export default function MapPage() {
  const pathname = usePathname()

  return (
    <section className="fixed inset-0 top-0 bottom-[73px] z-0 h-screen w-full" key={pathname}>
      <KakaoMapLoader key={pathname} />
    </section>
  )
}
