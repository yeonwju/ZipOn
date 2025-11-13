/**
 * API 엔드포인트 상수
 */

export const API_BASE_URL = 'http://localhost:8080'

export const API_ENDPOINTS = {
  // 매물
  LISTINGS_REG_VERIFY: '/api/v1/properties/verifications',
  LISTINGS_CREATE: '/api/v1/properties/detail',
  LISTINGS_DETAIL: (propertySeq: number) => `/api/v1/properties/${propertySeq}`,
  LISTINGS_SEARCH_MAP: '/api/v1/properties/map',
  LISTINGS_UPDATE: (propertySeq: number) => `/api/v1/properties/${propertySeq}`,
  LISTINGS_AUCTION_STATE_UPDATE: (propertySeq: number) => `/api/v1/properties/auc/${propertySeq}`,
  LISTINGS_DELETE: (propertySeq: number) => `/api/v1/properties/${propertySeq}`,

  // 사용자
  ACCESS_TOKEN_REFRESH: '/api/v1/jwt/refresh',
  GOOGLE_LOGIN: '/oauth2/authorization/google',
  USER_INFO: '/api/v1/user/me',
  COMPANY_STATUS: '/api/v1/company/status',
  BROKER_VERIFY: '/api/v1/broker',
  PHONE_VERIFY: '/api/v1/user/verify/sms',
  PHONE_VERIFY_CHECK: '/api/v1/user/verify/code',
  BUSSINESS_REGISTER: '/api/v1/broker',

  // 브로커
  REQUEST_BORKER_LIST: (
    propertySeq: number,
    pageable: { page: number; size: number; sort: string }
  ) => `/api/v1/auctions/${propertySeq}/applicants`,

  SELECT_BROKER: (auctionSeq: number) => `/api/v1/auctions/${auctionSeq}/accept`,
} as const

export const API_TIMEOUT = 10000 // 10초
