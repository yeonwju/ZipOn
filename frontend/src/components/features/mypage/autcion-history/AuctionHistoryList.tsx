'use client'

import Link from 'next/link'
import React from 'react'

import { ROUTES } from '@/constants'
import { useAuctionStatusStore } from '@/store/auctionStatus'

import AuctionHistoryCard from './AuctionHistoryCard'

interface AuctionHistoryListProps {
  className?: string
}

/**
 * 경매 내역 리스트
 */
export default function AuctionHistoryList({ className }: AuctionHistoryListProps) {
  // Zustand store에서 상태를 직접 구독 (상태 변경 시 리렌더링됨)
  const storedStatus = useAuctionStatusStore(state => state.bidStatusMap[1])

  // auctionSeq 1의 기본 상태는 'OFFERED', store에 값이 있으면 그것을 사용
  const auction1BidStatus = storedStatus || 'OFFERED'

  const auction1 = {
    thumbnail: '/live-room.svg',
    auctionSeq: 1,
    propertySeq: 23,
    contractSeq: 11,
    contractStatus: null,
    bidStatus: auction1BidStatus,
    address: '서울시 노원구 상계 불암대림아파트 202동 1201호',
    bidAmount: 1200000,
    bidRank: 0,
  }

  const auction2 = {
    thumbnail: '/listing.svg',
    auctionSeq: 2,
    propertySeq: 23,
    contractSeq: 11,
    contractStatus: null,
    bidStatus: 'WAITING',
    address: '양촌리 양벌동 경기 광주 양촌현대아파트 102동 101호',
    bidAmount: 900000,
    bidRank: 0,
  }

  const auction3 = {
    thumbnail: '/auction3.jpeg',
    auctionSeq: 3,
    propertySeq: 24,
    contractSeq: 12,
    contractStatus: null,
    bidStatus: 'ACCEPTED',
    address: '테헤란로 112길 멀티캠퍼스',
    bidAmount: 850000,
    bidRank: 0,
  }

  const auction4 = {
    thumbnail: '/auction4.png',
    auctionSeq: 4,
    propertySeq: 25,
    contractSeq: 13,
    contractStatus: null,
    bidStatus: 'REJECTED',
    address: '잠실 롯데월드',
    bidAmount: 910000,
    bidRank: 0,
  }

  const auction5 = {
    thumbnail: '/auction5.jpeg',
    auctionSeq: 5,
    propertySeq: 26,
    contractSeq: 14,
    contractStatus: null,
    bidStatus: 'WAITING',
    address: '용인시 애버랜드',
    bidAmount: 880000,
    bidRank: 0,
  }
  // const { data: auctionHistory, isLoading, isError } = useMyAuctions()

  // 로딩 중일 때 스켈레톤 표시
  // if (isLoading) {
  //   return <AuctionHistoryListSkeleton className={className} />
  // }

  // 데이터가 없거나 null일 때
  // if (isError || !auctionHistory || auctionHistory.length === 0) {
  //   return (
  //     <div className={className}>
  //       <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-16 text-center">
  //         <SearchX size={40} className="text-gray-400" />
  //         <p className="text-sm text-gray-500">경매 참여 내역이 없습니다.</p>
  //       </div>
  //     </div>
  //   )
  // }

  // const displayedItems = auctionHistory.slice(0, INITIAL_DISPLAY_COUNT)
  // const hasMore = auctionHistory.length > INITIAL_DISPLAY_COUNT

  return (
    <div className="flex flex-col">
      <div className={className}>
        <AuctionHistoryCard auctionData={auction1} />
        <AuctionHistoryCard auctionData={auction2} />
        <AuctionHistoryCard auctionData={auction3} />
        <AuctionHistoryCard auctionData={auction4} />
        <AuctionHistoryCard auctionData={auction5} />
      </div>

      <Link
        href={ROUTES.MY_AUCTIONS_HISTORY}
        className="mt-2 w-full rounded-md border-1 border-gray-300 bg-white py-3 text-center text-sm font-medium text-gray-700 shadow-md transition-colors hover:bg-gray-50"
      >
        더보기
      </Link>
    </div>
  )
}
