export interface ResponseM<T> {
  status: number
  message: string
  data: T[]
}

export interface ResponseS<T> {
  status: number
  message: string
  data: T
}

export interface LiveAuctionResponseData {
  auctionSeq: number
  propertySeq: number
  propertyNm: string
}

export interface LiveStartResponseData {
  liveSeq: number
  auctionSeq: number
  sessionId: string
  title: string
  thumbnail: string
  status: string
  host: {
    userSeq: number
    name: string
    profileImg: string
  }
  startAt: string
}
