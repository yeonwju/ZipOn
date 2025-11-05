export type AuctionHistory = {
  id: string // 내가 참여한 경매 인덱싱 번호
  title: string // 경매 매물 이름
  endDate: string // 경매 마감 날짜
  auctionState: boolean // 경매 진행 상태
  price: number | null // 내가 입찰한 금액
  waitingNumber: number | null // 경매종료후 대기 *번
}
