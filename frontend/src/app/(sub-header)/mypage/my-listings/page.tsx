import { Suspense } from 'react'

import MyListingsContent from '@/components/features/mypage/my-listings/MyListingsContent'
import MyListingsSkeleton from '@/components/skeleton/mypage/MyListingsSkeleton'

// TODO 내 매물 리스트 페이지 개발
export default function MyListingsPage() {
  return (
    <Suspense fallback={<MyListingsSkeleton />}>
      <MyListingsContent />
    </Suspense>
  )
}
