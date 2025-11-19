import { create } from 'zustand'

/**
 * 경매 입찰 상태 타입
 */
type BidStatus = 'WAITING' | 'OFFERED' | 'ACCEPTED' | 'REJECTED' | 'TIMEOUT' | 'LOST' | 'AI_CONTRACT'

/**
 * 경매 상태 관리 Store
 *
 * 각 경매(auctionSeq)별 입찰 상태를 관리합니다.
 * 새로고침 시 초기값으로 돌아갑니다.
 *
 * @example
 * ```tsx
 * // 상태 가져오기
 * const bidStatus = useAuctionStatusStore(state => state.getBidStatus(1))
 *
 * // 상태 변경하기
 * const setBidStatus = useAuctionStatusStore(state => state.setBidStatus)
 * setBidStatus(1, 'ACCEPTED')
 *
 * // 모든 상태 초기화
 * const resetAllStatus = useAuctionStatusStore(state => state.resetAllStatus)
 * resetAllStatus()
 * ```
 */
interface AuctionStatusState {
  // auctionSeq를 key로 하는 상태 맵
  bidStatusMap: Record<number, BidStatus>

  // 특정 경매의 상태 가져오기
  getBidStatus: (auctionSeq: number) => BidStatus | undefined

  // 특정 경매의 상태 설정하기
  setBidStatus: (auctionSeq: number, status: BidStatus) => void

  // 모든 상태 초기화
  resetAllStatus: () => void

  // 특정 경매 상태 초기화
  resetStatus: (auctionSeq: number) => void
}

export const useAuctionStatusStore = create<AuctionStatusState>((set, get) => ({
  bidStatusMap: {},

  getBidStatus: (auctionSeq: number) => {
    return get().bidStatusMap[auctionSeq]
  },

  setBidStatus: (auctionSeq: number, status: BidStatus) => {
    set(state => ({
      bidStatusMap: {
        ...state.bidStatusMap,
        [auctionSeq]: status,
      },
    }))
  },

  resetAllStatus: () => {
    set({ bidStatusMap: {} })
  },

  resetStatus: (auctionSeq: number) => {
    set(state => {
      const { [auctionSeq]: _, ...rest } = state.bidStatusMap
      return { bidStatusMap: rest }
    })
  },
}))

