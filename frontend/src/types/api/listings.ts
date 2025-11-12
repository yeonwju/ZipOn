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
