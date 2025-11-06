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
    <div className="flex w-full flex-col rounded-md border border-gray-200 p-3 shadow-sm">
      <div className="flex flex-row items-start gap-3">
        {/* 이미지 */}
        <div className="relative flex-1">
          <Image
            src="/live-room.svg"
            alt="매물 이미지"
            width={200}
            height={200}
            className="w-full rounded-md border border-gray-100 object-cover"
          />
          {/* 상단 뱃지 영역 */}
          <div className={'mt-2.5 flex flex-row items-start gap-1'}>
            {/* 진행 상태 */}
            <div
              className={`inline-flex w-[75px] items-center justify-center rounded-full px-2.5 py-0.5 ${
                auctionHistory.auctionState
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <span className="text-xs font-medium">
                {auctionHistory.auctionState ? '경매 진행중' : '경매 종료'}
              </span>
            </div>

            {/* 남은 시간 — '마감됨'은 표시 안 함 */}
            {remaining !== '마감됨' && (
              <div className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5">
                <span className="text-xs font-medium text-blue-700">{remaining}</span>
              </div>
            )}

            {/* 대기 순위 */}
            {!auctionHistory.auctionState && auctionHistory.waitingNumber && (
              <div className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5">
                <span className="text-xs font-medium text-orange-600">
                  대기: {auctionHistory.waitingNumber}위
                </span>
              </div>
            )}
          </div>
        </div>
        {/* 텍스트 정보 */}
        <div className="flex flex-1 flex-col gap-1">
          <span className="line-clamp-2 text-base font-semibold text-gray-800">
            {auctionHistory.title}
          </span>

          {/* 입찰가 */}
          {auctionHistory.price && (
            <div className="mt-2 flex flex-col gap-0.5">
              <span className="text-xs text-gray-500">내 입찰가</span>
              <span className="text-lg font-bold text-blue-600">
                {auctionHistory.price.toLocaleString('ko-KR')}
                <span className="text-sm font-normal text-gray-500">원</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 하단 버튼 영역 */}
      <div className="mt-3 flex w-full justify-center gap-2">
        {auctionHistory.auctionState ? (
          <>
            <button className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-400 hover:bg-gray-200">
              상세보기
            </button>
            <button className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-400 hover:bg-gray-200">
              결제하기
            </button>
          </>
        ) : (
          <>
            <button className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-400 hover:bg-gray-200">
              포기하기
            </button>
            <button className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-400 hover:bg-gray-200">
              결제하기
            </button>
          </>
        )}
      </div>
    </div>
  )
}
