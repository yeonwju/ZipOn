'use client'

import { SearchX } from 'lucide-react'
import { useMemo, useState } from 'react'

import MyBrokerageCard from '@/components/features/mypage/my-brokerage/MyBrokerageCard'
import MyListingListSkeleton from '@/components/skeleton/mypage/MyListingListSkeleton'
import { useMyBrokerage } from '@/queries/useMypage'

type BrokerageStatusFilter = 'all' | 'REQUESTED' | 'ACCEPTED' | 'CANCELED' | 'EXPIRED'

const FILTER_OPTIONS: { value: BrokerageStatusFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'REQUESTED', label: '요청됨' },
  { value: 'ACCEPTED', label: '수락됨' },
  { value: 'CANCELED', label: '취소됨' },
  { value: 'EXPIRED', label: '만료됨' },
]

export default function MyBrkList() {
  const { data: myBrokerage, isLoading, isError } = useMyBrokerage()
  const [selectedFilter, setSelectedFilter] = useState<BrokerageStatusFilter>('all')

  // 필터링된 데이터
  const filteredBrokerage = useMemo(() => {
    if (!myBrokerage) return []
    if (selectedFilter === 'all') return myBrokerage
    return myBrokerage.filter(brokerage => brokerage.auctionStatus === selectedFilter)
  }, [myBrokerage, selectedFilter])

  // 로딩 중일 때 스켈레톤 표시
  if (isLoading) {
    return (
      <div className="flex flex-col px-4 py-4">
        <MyListingListSkeleton />
      </div>
    )
  }

  // 데이터가 없거나 null일 때
  if (isError || !myBrokerage || myBrokerage.length === 0) {
    return (
      <div className="flex flex-col px-4 py-4">
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-16 text-center">
          <SearchX size={40} className="text-gray-400" />
          <p className="text-sm text-gray-500">중개 내역이 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col px-4 py-4">
      {/* 필터 탭 */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        {FILTER_OPTIONS.map(filter => (
          <button
            key={filter.value}
            onClick={() => setSelectedFilter(filter.value)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedFilter === filter.value
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.label}
            {selectedFilter === filter.value && filter.value !== 'all' && (
              <span className="ml-1.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-400 px-1.5 text-xs">
                {filteredBrokerage.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 필터링된 리스트 */}
      {filteredBrokerage.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filteredBrokerage.map(brokerage => (
            <MyBrokerageCard
              key={`${brokerage.auctionSeq}-${brokerage.propertySeq}`}
              brokerageData={brokerage}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-16 text-center">
          <SearchX size={40} className="text-gray-400" />
          <p className="text-sm text-gray-500">
            {FILTER_OPTIONS.find(f => f.value === selectedFilter)?.label} 상태의 중개 내역이
            없습니다.
          </p>
        </div>
      )}
    </div>
  )
}