export interface ListingsRegVerifyResponse {
  data?: {
    pdfCode: string
    verificationStatus: string
    isCertificated: true
    riskScore: number | null
    riskReason: string | null
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
