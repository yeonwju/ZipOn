import Image from 'next/image'

import { AuctionHistory } from '@/types/models/auction'

interface AuctionHistoryCardProps {
  auctionHistory: AuctionHistory
}

// 남은 시간 계산 함수
function getRemainingTime(endDate: string): string {
  const now = new Date()
  const end = new Date(endDate)
  const diffMs = end.getTime() - now.getTime()

  if (diffMs <= 0) return '마감됨'

  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffDay > 0) return `D-${diffDay}`
  if (diffHour > 0) return `-${diffHour}시간 ${diffMin % 60}분`
  if (diffMin > 0) return `-${diffMin}분`
  return `${diffSec}초 남음`
}

export default function AuctionHistoryCard({ auctionHistory }: AuctionHistoryCardProps) {
  const remaining = getRemainingTime(auctionHistory.endDate)

  return (
    <div className="flex w-full flex-col rounded-lg border border-gray-200 bg-white p-2.5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-row items-center gap-2.5">
        {/* 이미지 */}
        <div className="relative w-24 flex-shrink-0">
          <Image
            src="/live-room.svg"
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
            {/* 진행 상태 */}
            <div
              className={`inline-flex items-center rounded-full px-1.5 py-0.5 ${
                auctionHistory.auctionState
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <span className="text-[10px] font-medium">
                {auctionHistory.auctionState ? '진행중' : '종료'}
              </span>
            </div>

            {/* 남은 시간 */}
            {remaining !== '마감됨' && (
              <div className="inline-flex items-center rounded-full bg-blue-100 px-1.5 py-0.5">
                <span className="text-[10px] font-medium text-blue-700">{remaining}</span>
              </div>
            )}

            {/* 대기 순위 */}
            {!auctionHistory.auctionState && auctionHistory.waitingNumber && (
              <div className="inline-flex items-center rounded-full bg-orange-100 px-1.5 py-0.5">
                <span className="text-[10px] font-medium text-orange-600">
                  대기 {auctionHistory.waitingNumber}위
                </span>
              </div>
            )}
          </div>
          {/* 상단: 제목 + 뱃지들 */}
          <div className="flex items-center gap-1">
            <span className="line-clamp-1 text-sm font-semibold text-gray-900">
              {auctionHistory.title}
            </span>
          </div>

          {/* 입찰가 */}
          {auctionHistory.price && (
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xs text-gray-500">내 입찰가</span>
              <span className="text-base font-bold text-blue-600">
                {auctionHistory.price.toLocaleString('ko-KR')}
              </span>
              <span className="text-xs text-gray-500">원</span>
            </div>
          )}

          {/* 버튼 영역 */}
          <div className="mt-1.5 flex gap-1.5">
            {auctionHistory.auctionState ? (
              <>
                <button className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">
                  상세
                </button>
                <button className="flex-1 rounded border border-blue-300 bg-white px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50">
                  결제
                </button>
              </>
            ) : (
              <>
                <button className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">
                  포기
                </button>
                <button className="flex-1 rounded border border-blue-300 bg-white px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50">
                  결제
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
