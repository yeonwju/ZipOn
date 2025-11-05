import Image from 'next/image'

export interface AuctionHistoryCard {
  id: string // 내가 참여한 경매 인덱싱 번호
  title: string // 경매 매물 이름
  endDate: string // 경매 마감 시간
  auctionState: boolean // 경매 진행 상태
  price: number | null // 내가 입찰한 금액
  waitingNumber: number | null // 경매종료후 대기 *번
}

export default function AuctionHistoryCard({
  // id,
  title,
  endDate,
  auctionState,
  price,
  waitingNumber,
}: AuctionHistoryCard) {
  return (
    <div className={'flex w-full rounded-md border border-gray-200'}>
      <div>
        <div>
          <div>{title}</div>
          <div>{endDate}</div>
          <div>{auctionState}</div>
          <div>{price}</div>
          <div>{waitingNumber}</div>
        </div>
        <Image src="/live-room.svg" alt={'매물 이미지'} width={122} height={111} />
      </div>
      <div>
        <button>상세보기</button>
        <button>결제하기</button>
      </div>
      <div>
        <button>포기하기</button>
        <button>결제하기</button>
      </div>
    </div>
  )
}
