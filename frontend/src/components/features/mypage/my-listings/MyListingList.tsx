'use client'

import { SearchX } from 'lucide-react'
import Link from 'next/link'

import MyListingCard from '@/components/features/mypage/my-listings/MyListingCard'
import MyListingListSkeleton from '@/components/skeleton/mypage/MyListingListSkeleton'
import { ROUTES } from '@/constants'
import { useMyProperties } from '@/queries/useMypage'

interface MyListingListProps {
  className?: string
}
const INITIAL_DISPLAY_COUNT = 2

export default function MyListingList({ className }: MyListingListProps) {
  const { data: myListings, isLoading, isError } = useMyProperties()

  if (isLoading) {
    return <MyListingListSkeleton className={className} />
  }

  if (isError || !myListings || myListings.length === 0) {
    return (
      <div className={className}>
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-16 text-center">
          <SearchX size={40} className="text-gray-400" />
          <p className="text-sm text-gray-500">본인 소유 등록된 매물이 없습니다.</p>
        </div>
      </div>
    )
  }
  const displayedItems = myListings.slice(0, INITIAL_DISPLAY_COUNT)
  const hasMore = myListings.length > INITIAL_DISPLAY_COUNT

  return (
    <div className="flex flex-col">
      <div className={className}>
        {displayedItems.map(property => (
          <MyListingCard key={property.propertySeq} propertyData={property} />
        ))}
      </div>

      {hasMore && (
        <Link
          href={ROUTES.MY_LISTINGS}
          className="mt-2 w-full rounded-md border-1 border-gray-300 bg-white py-3 text-center text-sm font-medium text-gray-700 shadow-md transition-colors hover:bg-gray-50"
        >
          더보기
        </Link>
      )}
    </div>
  )
}
