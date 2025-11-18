//나의 매물 내역 조회
export interface MyPropertiesData {
  thumbnail: string
  propertySeq: number
  buildingType: string
  address: string
  deposit: number
  mnRent: number
}

//나의 중개 내역 조회
export interface MyBrokerageData {
  thumbnail: string
  propertySeq: number
  auctionSeq: number
  auctionStatus: string
  buildingType: string
  address: string
  deposit: number
  mnRent: number
}

//나의 경매 참여 내역 조회
export interface MyAuctionsData {
  thumbnail: string
  auctionSeq: number
  propertySeq: number
  contractSeq: number | null
  contractStatus: string | null
  bidStatus: string
  address: string
  bidAmount: number
  bidRank: number
}
