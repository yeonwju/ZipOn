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
  REQUEST_BORKER_LIST: (propertySeq: number) => `/api/v1/auctions/${propertySeq}/applicants`,
  REQUEST_BROKER: (propertySeq: number) => `/api/v1/auctions/applications/${propertySeq}`,
  SELECT_BROKER: (auctionSeq: number) => `/api/v1/auctions/${auctionSeq}/accept`,

  // 채팅
  CREATE_CHAT: '/api/v1/chat/room',
  CHAT_ROOM_HISTORY: (roomSeq: number) => `/api/v1/chat/room/${roomSeq}/history`,
  CHAT_ROOM_LIST: `/api/v1/chat/my/rooms`,
  CHAT_ROOM_LEAVE: (roomId: number) => `/api/v1/chat/room/${roomId}/leave`,
  CHAT_MESSAGE_READ_CHECK: (roomSeq: number) => `/api/v1/chat/room/${roomSeq}/read`,

  // 라이브
  CAN_LIVE_AUCTION: '/api/v1/live/auctions',
  START_LIVE: '/api/v1/live',
} as const

export const API_TIMEOUT = 10000 // 10초
