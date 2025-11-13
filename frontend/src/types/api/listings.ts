export interface ListingsRegVerifyResponse {
  data: {
    pdfCode: string
    verificationStatus: string
    isCertificated: true
    riskScore: number
    riskReason: string
  }
  message: string
  status: number
  timestamp?: string | null
}

export interface ListingsRegVerifyRequest {
  file: File[]
  regiNm: string | null | undefined
  regiBirth: string | null | undefined
  address: string
}

export interface RegListingRequest {
  req: string
  images: File[]
}

export interface RegListingResponse {
  data: {
    propertySeq: number
  }
  message: string
  status: number
  timestamp?: string | null
}

export interface ListingDetailDataResponse {
  buildingType: string
  propertySeq: number
  lessorSeq?: number // 집주인(매물 등록자) Seq
  brkSeq?: number // 중개인 Seq
  auctionSeq?: number
  lessorNm: string
  propertyNm: string
  content: string
  address: string
  latitude: number
  longitude: number
  area: number
  areaP: number
  deposit: number
  mnRent: number
  fee: number
  images: string[]
  period: number
  floor: number
  facing: string
  roomCnt: number
  bathroomCnt: number
  constructionDate: string
  parkingCnt: number
  hasElevator: boolean
  petAvailable: boolean
  isAucPref: boolean
  isBrkPref: boolean
  hasBrk: boolean
  aucAt: string
  aucAvailable: string
  liveAt?: string // 라이브 시작 날짜/시간 (ISO 8601 형식)
  pdfCode: string
  isCertificated: boolean
  riskScore: number
  riskReason: string
}

export type ListingDetailResponse = {
  data: ListingDetailDataResponse
  message: string
  status: number
  timestamp: number
}
