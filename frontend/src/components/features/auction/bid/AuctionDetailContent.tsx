'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'

import { AuctionDetail } from '@/components/features/auction'
import { useAlertDialog } from '@/components/ui/alert-dialog'
import { listingQueryKeys } from '@/constants'
import { useBid } from '@/queries/useBid'
import { useSearchListingDetail } from '@/queries/useListing'
import { ListingDetailDataResponse } from '@/types/api/listings'

export default function AuctionDetailContent() {
  // 매물 seq 값 가져오기 (쿼리 파라미터에서)
  const searchParams = useSearchParams()
  const propertySeqParam = searchParams.get('propertySeq')
  const auctionSeqParam = searchParams.get('id')
  const propertySeq = propertySeqParam ? Number(propertySeqParam) : null

  const queryClient = useQueryClient()
  const queryKey = propertySeq ? listingQueryKeys.detail(propertySeq) : null

  const { showSuccess, showError, AlertDialog } = useAlertDialog()
  const { mutate: bidMutation } = useBid()

  // 캐시가 없으면 useQuery로 가져오기 (캐시에 저장됨)
  // propertySeq가 없어도 hook은 호출해야 하므로 조건부로 enabled 사용
  const { data: queryData, isLoading } = useSearchListingDetail(propertySeq || 0, {
    enabled: !!propertySeq,
  } as { enabled?: boolean })

  // 먼저 캐시에서 가져오기
  const cachedData = queryKey ? queryClient.getQueryData<ListingDetailDataResponse>(queryKey) : null

  // 디버깅: 캐시 키 확인
  console.log('=== 경매 상세 페이지 캐시 확인 ===')
  console.log('propertySeq:', propertySeq)
  console.log('queryKey:', queryKey)
  console.log('cachedData:', cachedData)

  // 캐시된 데이터가 있으면 사용, 없으면 queryData 사용
  const data = cachedData || queryData

  console.log('queryData:', queryData)
  console.log(
    '전체 캐시:',
    queryClient
      .getQueryCache()
      .getAll()
      .map(q => ({ queryKey: q.queryKey, state: q.state }))
  )
  console.log('==========================')

  // 로딩 중
  if (isLoading && !cachedData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    )
  }

  // 데이터가 없으면 에러 처리
  if (!data) {
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
  const auctionEndTime = new Date('2025-11-20T24:00:00')

  const handleBid = (_amount: number) => {
    if (!auctionSeqParam) return

    bidMutation(
      { auctionSeq: Number(auctionSeqParam), amount: _amount },
      {
        onSuccess: result => {
          showSuccess(result?.message || '입찰 완료')
        },
        onError: error => {
          showError(
            error instanceof Error ? error.message : '입찰 실패했습니다. 다시 시도해주세요.'
          )
        },
      }
    )
  }

  return (
    <>
      <AuctionDetail
        data={data}
        auctionEndTime={auctionEndTime}
        minimumBid={50000}
        deposit={data.deposit}
        lessorName={data.lessorNm}
        lessorImage={data.lessorProfileImg}
        onBid={handleBid}
      />
      <AlertDialog />
    </>
  )
}
