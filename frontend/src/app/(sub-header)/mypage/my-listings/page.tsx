'use client'

import { SearchX } from 'lucide-react'

import MyListingCard from '@/components/features/mypage/my-listings/MyListingCard'
import MyListingListSkeleton from '@/components/skeleton/mypage/MyListingListSkeleton'
import { useMyProperties } from '@/queries/useMypage'

export default function MyListingsPage() {
  const { data: myListings, isLoading, isError } = useMyProperties()

  // 로딩 중일 때 스켈레톤 표시
  if (isLoading) {
    return (
      <div className="flex flex-col px-4 py-4">
        <MyListingListSkeleton />
      </div>
    )
  }

  // 데이터가 없거나 null일 때
  if (isError || !myListings || myListings.length === 0) {
    return (
      <div className="flex flex-col px-4 py-4">
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-16 text-center">
          <SearchX size={40} className="text-gray-400" />
          <p className="text-sm text-gray-500">본인 소유 등록된 매물이 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col px-4 py-4">
      {/* 매물 리스트 */}
      <div className="flex flex-col gap-3">
        {myListings.map(property => (
          <MyListingCard key={property.propertySeq} propertyData={property} />
        ))}
      </div>
    </div>
  )
}