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

export interface LiveAuctionData {
  auctionSeq: number
  propertySeq: number
  propertyNm: string
}

export interface LiveStartData {
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

export interface LiveListData {
  liveSeq: number
  auctionSeq: number
  sessionId: string
  title: string
  thumbnail: string
  status: string
  viewerCount: number
  chatCount: number
  likeCount: number
  host: {
    userSeq: number
    name: string
    profileImg: string
  }
  startAt: string
  endAt: string
  liked: boolean
}

export interface LiveEnterTokenData {
  token: string
  sessionId: string
  role: string
}

export interface LiveEndData {
  liveSeq: number
  auctionSeq: number
  sessionId: string
  title: string
  thumbnail: string
  status: string
  viewerCount: number
  chatCount: number
  likeCount: number
  host: {
    userSeq: number
    name: string
    profileImg: string
  }
  startAt: string
  endAt: string
}

export interface LiveInfoData {
  liveSeq: number
  auctionSeq: number
  sessionId: string
  title: string
  thumbnail: string
  status: string
  viewerCount: number
  chatCount: number
  likeCount: number
  host: {
    userSeq: number
    name: string
    profileImg: string
  }
  startAt: string
  endAt: string
  liked: boolean
}

export interface LiveChatHistory {
  liveSeq: number
  senderSeq: number
  senderName: string
  content: string
  sentAt: string
}
