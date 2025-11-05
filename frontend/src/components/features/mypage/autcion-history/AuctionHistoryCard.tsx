import Image from 'next/image'
import type { AuctionHistory } from '@/types/api/mypage/auctionHistory'

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

  if (diffDay > 0) return `${diffDay}일 남음`
  if (diffHour > 0) return `${diffHour}시간 ${diffMin % 60}분 남음`
  if (diffMin > 0) return `${diffMin}분 남음`
  return `${diffSec}초 남음`
}

export default function AuctionHistoryCard({ auctionHistory }: AuctionHistoryCardProps) {
  const remaining = getRemainingTime(auctionHistory.endDate)

  return (
    <div className="flex w-full flex-col rounded-md border border-gray-200 p-3 shadow-sm">
      {/* 상단 영역 */}
      <div className="flex flex-row items-start justify-between gap-2">
        {/* 텍스트 정보 */}
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold text-gray-800">{auctionHistory.title}</span>

          {/* 남은 시간 — '마감됨'은 표시 안 함 */}
          {remaining !== '마감됨' && (
            <span className="text-sm font-medium text-blue-600">{remaining}</span>
          )}

          {/* 진행 상태 */}
          <span
            className={`text-sm ${auctionHistory.auctionState ? 'text-green-600' : 'text-red-500'}`}
          >
            {auctionHistory.auctionState ? '경매 진행중' : '경매 종료'}
          </span>

          {/* 대기 순위 */}
          {!auctionHistory.auctionState && auctionHistory.waitingNumber && (
            <div className="text-sm text-gray-500">현재 {auctionHistory.waitingNumber}순위</div>
          )}
        </div>

        {/* 이미지 */}
        <Image
          src="/live-room.svg"
          alt="매물 이미지"
          width={150}
          height={120}
          className="rounded-md border border-gray-100 object-cover"
        />
      </div>

      {/* 입찰가 */}
      {auctionHistory.price && (
        <div className="mt-2 text-sm text-gray-700">
          내 입찰가: {auctionHistory.price.toLocaleString('ko-KR')}원
        </div>
      )}

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
