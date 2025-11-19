import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useAlertDialog } from '@/components/ui/alert-dialog'
import { ROUTES } from '@/constants'
import { useBidReject } from '@/queries/useBid'
import { useAuctionStatusStore } from '@/store/auctionStatus'
import { MyAuctionsData } from '@/types/api/mypage'
import { formatCurrency, normalizeThumbnailUrl } from '@/utils/format'

interface AuctionHistoryCardProps {
  auctionData: MyAuctionsData
}

// 입찰 상태 뱃지 표시
function getBidStatusBadge(status: string) {
  const statusConfig: Record<string, { text: string; color: string }> = {
    WAITING: { text: '대기', color: 'bg-yellow-100 text-yellow-700' },
    OFFERED: { text: '제시', color: 'bg-blue-100 text-blue-700' },
    ACCEPTED: { text: '수락', color: 'bg-green-100 text-green-700' },
    REJECTED: { text: '거절', color: 'bg-red-100 text-red-700' },
    TIMEOUT: { text: '경매 종료', color: 'bg-gray-100 text-gray-700' },
    LOST: { text: '10위권 밖', color: 'bg-red-100 text-red-700' },
  }

  const config = statusConfig[status]
  if (!config) return null

  return (
    <div className={`inline-flex items-center rounded-full px-1.5 py-0.5 ${config.color}`}>
      <span className="text-[10px] font-medium">{config.text}</span>
    </div>
  )
}

export default function AuctionHistoryCard({ auctionData }: AuctionHistoryCardProps) {
  const { showSuccess, showError, AlertDialog } = useAlertDialog()
  const { mutate: rejectBid } = useBidReject()
  const router = useRouter()

  // Zustand store에서 상태 변경 함수 가져오기
  const setBidStatus = useAuctionStatusStore(state => state.setBidStatus)

  // store에 저장된 상태를 직접 구독 (상태 변경 시 리렌더링됨)
  const storedStatus = useAuctionStatusStore(state => state.bidStatusMap[auctionData.auctionSeq])
  const currentBidStatus = storedStatus || auctionData.bidStatus

  const thumbnailUrl = normalizeThumbnailUrl(auctionData.thumbnail, '/live-room.svg')
  const isExternalUrl = thumbnailUrl.startsWith('https://')

  return (
    <div className="flex w-full flex-col rounded-lg border border-gray-200 bg-white p-2.5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-row items-center gap-2.5">
        {/* 이미지 */}
        <div className="relative w-24 flex-shrink-0">
          <Image
            src={thumbnailUrl}
            alt="매물 이미지"
            width={96}
            height={96}
            className="h-24 w-24 rounded-md object-cover"
            unoptimized={isExternalUrl}
          />
        </div>

        {/* 텍스트 정보 */}
        <div className="flex flex-1 flex-col gap-0.5">
          {/* 뱃지 영역 */}
          <div className="flex flex-wrap items-center gap-1">
            {getBidStatusBadge(currentBidStatus)}
            {currentBidStatus !== 'LOST' && (
              <div className="inline-flex items-center rounded-full bg-orange-100 px-1.5 py-0.5">
                <span className="text-[10px] font-medium text-orange-700">
                  {auctionData.bidRank}위
                </span>
              </div>
            )}
          </div>

          {/* 주소 */}
          <span className="line-clamp-1 text-sm font-semibold text-gray-900">
            {auctionData.address}
          </span>

          {/* 입찰가 */}
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xs text-gray-500">입찰가</span>
            <span className="text-base font-bold text-blue-600">
              {formatCurrency(auctionData.bidAmount)}
            </span>
          </div>

          {/* 버튼 영역 */}
          <div className="mt-1.5 flex gap-1.5">
            {currentBidStatus === 'OFFERED' && (
              <>
                <button
                  onClick={() => {
                    // API 호출처럼 보이도록 0.7초 딜레이 후 상태 변경 및 다이얼로그 표시
                    setTimeout(() => {
                      setBidStatus(auctionData.auctionSeq, 'ACCEPTED')
                      showSuccess('낙찰을 성공적으로 수락하였습니다.', () => router.push('/mypage'))
                    }, 700)
                  }}
                  className="flex-1 rounded border border-green-300 bg-white px-2 py-1 text-xs font-medium text-green-600 hover:bg-green-50"
                >
                  수락
                </button>

                <button
                  onClick={() => {
                    rejectBid(auctionData.auctionSeq, {
                      onSuccess: result => {
                        showSuccess(result.message || '입찰을 거절했습니다.')
                      },
                      onError: error => {
                        showError(
                          error instanceof Error
                            ? error.message
                            : '입찰 거절에 실패했습니다. 다시 시도해주세요.'
                        )
                      },
                    })
                  }}
                  className="flex-1 rounded border border-red-300 bg-white px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  거절
                </button>
                <button
                  onClick={() => {
                    router.push(
                      `/auction/${auctionData.auctionSeq}?propertySeq=${auctionData.propertySeq}`
                    )
                  }}
                  className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  더보기
                </button>
              </>
            )}
            {currentBidStatus === 'WAITING' && (
              <>
                <Link
                  href={ROUTES.LISTING_DETAIL(auctionData.propertySeq)}
                  className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-center text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  상세
                </Link>
                <button
                  onClick={() => {
                    router.push(
                      `/auction/${auctionData.auctionSeq}?propertySeq=${auctionData.propertySeq}`
                    )
                  }}
                  className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  더보기
                </button>
              </>
            )}
            {/* contractStatus가 WAITING_AI_REVIEW일 때 */}
            {currentBidStatus === 'AI_CONTRACT' && (
              <>
                <Link
                  href={ROUTES.LISTING_DETAIL(auctionData.propertySeq)}
                  className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-center text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  상세보기
                </Link>
                <button
                  onClick={() => {
                    router.push(`/contract?contractSeq=${auctionData.contractSeq}`)
                  }}
                  className="flex-1 rounded border border-blue-300 bg-white px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                >
                  계약하기
                </button>
                <button
                  onClick={() => {
                    router.push(
                      `/auction/${auctionData.auctionSeq}?propertySeq=${auctionData.propertySeq}`
                    )
                  }}
                  className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  더보기
                </button>
              </>
            )}
            {currentBidStatus === 'ACCEPTED' &&
              auctionData.contractStatus !== 'WAITING_AI_REVIEW' && (
                <>
                  <Link
                    href={ROUTES.LISTING_DETAIL(auctionData.propertySeq)}
                    className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-center text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    상세
                  </Link>
                  <button
                    onClick={() => {
                      router.push(`/auction/1/payment/pending?propertySeq=23&contractSeq=11`)
                      console.log('결제:', auctionData.auctionSeq)
                    }}
                    className="flex-1 rounded border border-blue-300 bg-white px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                  >
                    결제
                  </button>
                  <button
                    onClick={() => {
                      router.push(
                        `/auction/${auctionData.auctionSeq}?propertySeq=${auctionData.propertySeq}`
                      )
                    }}
                    className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    더보기
                  </button>
                </>
              )}
            {(currentBidStatus === 'REJECTED' ||
              currentBidStatus === 'LOST' ||
              currentBidStatus === 'TIMEOUT') && (
              <>
                <Link
                  href={ROUTES.LISTING_DETAIL(auctionData.propertySeq)}
                  className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-center text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  상세
                </Link>
                <button
                  onClick={() => {
                    router.push(
                      `/auction/${auctionData.auctionSeq}?propertySeq=${auctionData.propertySeq}`
                    )
                  }}
                  className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  더보기
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <AlertDialog />
    </div>
  )
}
