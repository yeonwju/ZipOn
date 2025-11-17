'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'

import { AuctionDetail } from '@/components/features/auction'
import { listingQueryKeys } from '@/constants'
import { useSearchListingDetail } from '@/hooks/queries/useListing'
import { ListingDetailDataResponse } from '@/types/api/listings'

export default function AuctionDetailContent() {
  // 매물 seq 값 가져오기 (쿼리 파라미터에서)
  const searchParams = useSearchParams()
  const propertySeqParam = searchParams.get('propertySeq')
  const propertySeq = propertySeqParam ? Number(propertySeqParam) : null
  
  // 매물 seq 캐싱된 정보값 가져오기 (hooks는 항상 최상위에서 호출)
  const queryClient = useQueryClient()
  const queryKey = propertySeq ? listingQueryKeys.detail(propertySeq) : null
  
  // 캐시가 없으면 useQuery로 가져오기 (캐시에 저장됨)
  // propertySeq가 없어도 hook은 호출해야 하므로 조건부로 enabled 사용
  const { data: queryData, isLoading } = useSearchListingDetail(propertySeq || 0, {
    enabled: !!propertySeq,
  } as { enabled?: boolean })
  
  // 먼저 캐시에서 가져오기
  const cachedData = queryKey
    ? queryClient.getQueryData<{
        success: boolean
        data?: ListingDetailDataResponse
      }>(queryKey)
    : null
  
  // 디버깅: 캐시 키 확인
  console.log('=== 경매 상세 페이지 캐시 확인 ===')
  console.log('propertySeq:', propertySeq)
  console.log('queryKey:', queryKey)
  console.log('cachedData:', cachedData)
  
  // 캐시된 데이터가 있으면 사용, 없으면 queryData 사용
  const response = cachedData || queryData
  
  console.log('queryData:', queryData)
  console.log('전체 캐시:', queryClient.getQueryCache().getAll().map(q => ({ queryKey: q.queryKey, state: q.state })))
  console.log('==========================')

  // 로딩 중
  if (isLoading && !cachedData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    )
  }

  // 캐싱된 데이터가 없으면 에러 처리
  if (!response || !response.success || !response.data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">매물 정보를 불러올 수 없습니다.</p>
          <p className="mt-2 text-sm text-gray-400">
            {cachedData ? '캐시된 데이터가 없습니다.' : '데이터를 불러오는 중 오류가 발생했습니다.'}
          </p>
        </div>
      </div>
    )
  }

  const data = response.data
  const auctionEndTime = new Date('2025-11-20T24:00:00')

  const handleBid = (_amount: number) => {
    // TODO: 실제 입찰 API 호출
  }

  return (
    <AuctionDetail
      data={data}
      auctionEndTime={auctionEndTime}
      minimumBid={50000}
      deposit={data.deposit || 20000000}
      lessorName={data.lessorNm || '변가원'}
      lessorImage={data.lessorProfileImg || '/profile.svg'}
      onBid={handleBid}
    />
  )
}
