'use client'

import { SearchX } from 'lucide-react'
import Link from 'next/link'

import MyBrokerageCard from '@/components/features/mypage/my-brokerage/MyBrokerageCard'
import { ROUTES } from '@/constants'
import { useMyBrokerage } from '@/queries/useMypage'

import MyListingListSkeleton from '../../../skeleton/mypage/MyListingListSkeleton'

interface MyBrokerageListProps {
  className?: string
}
const INITIAL_DISPLAY_COUNT = 2

export default function MyBrokerageList({ className }: MyBrokerageListProps) {
  const { data: myBrokerage, isLoading, isError } = useMyBrokerage()

  if (isLoading) {
    return <MyListingListSkeleton className={className} />
  }

  if (isError || !myBrokerage || myBrokerage.length === 0) {
    return (
      <div className={className}>
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-16 text-center">
          <SearchX size={40} className="text-gray-400" />
          <p className="text-sm text-gray-500">중개 내역이 없습니다.</p>
        </div>
      </div>
    )
  }
  const displayedItems = myBrokerage.slice(0, INITIAL_DISPLAY_COUNT)
  const hasMore = myBrokerage.length > INITIAL_DISPLAY_COUNT

  return (
    <div className="flex flex-col">
      <div className={className}>
        {displayedItems.map(brokerage => (
          <MyBrokerageCard
            key={`${brokerage.auctionSeq}-${brokerage.propertySeq}`}
            brokerageData={brokerage}
          />
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

