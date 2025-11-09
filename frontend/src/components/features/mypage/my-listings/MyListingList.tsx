'use client'

import { SearchX } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import MyListingCard from '@/components/features/mypage/my-listings/MyListingCard'
import MyListingListSkeleton from '@/components/features/mypage/skeleton/MyListingListSkeleton'
import { ROUTES } from '@/constants'
import { mockMyListings } from '@/data/MyListingsDummy'
import { MyListing } from '@/types'

interface MyListingListProps {
  className?: string
}
const INITIAL_DISPLAY_COUNT = 2

export default function MyListingList({ className }: MyListingListProps) {
  const [myListings, setMyListings] = useState<MyListing[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMyListing = async () => {
      try {
        setIsLoading(true)

        // 👇 실제 API 호출로 교체될 부분
        // const response = await fetch('/api/my-listings', { credentials: 'include' })
        // const data = await response.json()
        // setMyListings(data.data)

        // 시뮬레이션 딜레이
        await new Promise(resolve => setTimeout(resolve, 2000))

        // 💡 테스트: Empty State 확인용 (데이터 있는 상태로 되돌리려면 아래 두 줄 바꾸기)
        // setMyListings([])  // ← Empty State 테스트
        setMyListings(mockMyListings) // ← 정상 데이터
      } catch (error) {
        console.error('Failed to fetch my listings:', error)
        setMyListings([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchMyListing()
  }, [])

  if (isLoading) {
    return <MyListingListSkeleton className={className} />
  }

  if (!myListings || myListings.length === 0) {
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
        {displayedItems.map(myListings => (
          <MyListingCard key={myListings.propertySeq} myListing={myListings} />
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
