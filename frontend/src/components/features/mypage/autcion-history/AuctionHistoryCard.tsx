import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useAlertDialog } from '@/components/ui/alert-dialog'
import { ROUTES } from '@/constants'
import { useBidAccept, useBidReject } from '@/queries/useBid'
import { MyAuctionsData } from '@/types/api/mypage'

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
  const { mutate: acceptBid } = useBidAccept()
  const { mutate: rejectBid } = useBidReject()
  const router = useRouter()

  return (
    <div className="flex w-full flex-col rounded-lg border border-gray-200 bg-white p-2.5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-row items-center gap-2.5">
        {/* 이미지 */}
        <div className="relative w-24 flex-shrink-0">
          <Image
            src={auctionData.thumbnail || '/live-room.svg'}
            alt="매물 이미지"
            width={96}
            height={96}
            className="h-24 w-24 rounded-md object-cover"
          />
        </div>

        {/* 텍스트 정보 */}
        <div className="flex flex-1 flex-col gap-0.5">
          {/* 뱃지 영역 */}
          <div className="flex flex-wrap items-center gap-1">
            {getBidStatusBadge(auctionData.bidStatus)}
            {auctionData.bidStatus !== 'LOST' && (
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
              {auctionData.bidAmount.toLocaleString('ko-KR')}
            </span>
            <span className="text-xs text-gray-500">원</span>
          </div>

          {/* 버튼 영역 */}
          <div className="mt-1.5 flex gap-1.5">
            {auctionData.bidStatus === 'OFFERED' && (
              <>
                <button
                  onClick={() => {
                    acceptBid(auctionData.auctionSeq, {
                      onSuccess: result => {
                        showSuccess(result?.message || '입찰을 수락했습니다.')
                      },
                      onError: error => {
                        showError(
                          error instanceof Error
                            ? error.message
                            : '입찰 수락에 실패했습니다. 다시 시도해주세요.'
                        )
                      },
                    })
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
              </>
            )}
            {auctionData.bidStatus === 'WAITING' && (
              <Link
                href={ROUTES.LISTING_DETAIL(auctionData.propertySeq)}
                className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-center text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                상세
              </Link>
            )}
            {/* contractStatus가 WAITING_AI_REVIEW일 때 */}
            {auctionData.contractStatus && auctionData.contractStatus === 'WAITING_AI_REVIEW' && (
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
              </>
            )}
            {auctionData.bidStatus === 'ACCEPTED' &&
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
                      router.push(
                        `/auction/${auctionData.auctionSeq}/payment/pending?propertySeq=${auctionData.propertySeq}&contractSeq=${auctionData.contractSeq}`
                      )
                      console.log('결제:', auctionData.auctionSeq)
                    }}
                    className="flex-1 rounded border border-blue-300 bg-white px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                  >
                    결제
                  </button>
                </>
              )}
            {(auctionData.bidStatus === 'REJECTED' ||
              auctionData.bidStatus === 'LOST' ||
              auctionData.bidStatus === 'TIMEOUT') && (
              <Link
                href={ROUTES.LISTING_DETAIL(auctionData.propertySeq)}
                className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-center text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                상세
              </Link>
            )}
          </div>
        </div>
      </div>
      <AlertDialog />
    </div>
  )
}
