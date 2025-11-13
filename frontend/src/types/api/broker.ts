// 중개인 정보 타입
export interface BrokerInfo {
  auctionSeq: number
  brkUserSeq: number
  brkNm: string
  brkProfileImg: string | null
  status: string
  mediateCnt: number
  intro: string
  strmDate: string
  strmStartTm: string
  strmEndTm: string
}

// 백엔드 API 응답 타입 (페이지네이션 포함)
export interface GetBrokerListResponseDTO {
  data: {
    content: BrokerInfo[]
    pageable: {
      pageNumber: number
      pageSize: number
      sort: {
        empty: boolean
        sorted: boolean
        unsorted: boolean
      }
      offset: number
      paged: boolean
      unpaged: boolean
    }
    last: boolean
    totalPages: number
    totalElements: number
    size: number
    number: number
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    first: boolean
    numberOfElements: number
    empty: boolean
  }
  message: string
  status: number
  timestamp?: string | null
}
