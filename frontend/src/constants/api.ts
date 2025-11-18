/**
 * API 엔드포인트 상수
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

export const API_ENDPOINTS = {
  // 매물
  LISTINGS_REG_VERIFY: '/api/v1/properties/verifications',
  LISTINGS_CREATE: '/api/v1/properties/detail',
  LISTINGS_DETAIL: (propertySeq: number) => `/api/v1/properties/${propertySeq}`,
  LISTINGS_SEARCH_MAP: '/api/v1/properties/map',
  LISTINGS_SEARCH: '/api/v1/properties/search',
  LISTINGS_DELETE: (propertySeq: number) => `/api/v1/properties/${propertySeq}`,
  LISTINGS_AUCTION: `/api/v1/properties/search?isAuc=true`,
  LISTINGS_GENERAL: `/api/v1/properties/search?isAuc=false&isBrk=false`,
  LISTINGS_BRK: `/api/v1/properties/search?isAuc=true&isBrk=true&hasBrk=false`,

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

  // 경매
  BID: '/api/v1/auction/bid',
  BID_ACCEPT: (auctionSeq: number) => `/api/v1/auction/bid/${auctionSeq}/accept`,
  BID_REJECT: (auctionSeq: number) => `/api/v1/auction/bid/${auctionSeq}/reject`,
  BID_AMOUNT: (auctionSeq: number) => `/api/v1/auction/bid/${auctionSeq}`,

  // 계약
  CONTRACT_SUCCESS: (contractSeq: number) => `/api/v1/contracts/${contractSeq}/settlement`,
  CONTRACT_PROXY_ACCOUNT: (contractSeq: number) => `/api/v1/contracts/${contractSeq}/init`,
  CONTRACT_PAYMENT: (contractSeq: number) => `/api/v1/contracts/${contractSeq}/first-rent`,
  CONTRACT_AI_VERIFY: `/api/v1/contracts/verify`,

  // 라이브
  CAN_LIVE_AUCTION: '/api/v1/live/auctions',
  START_LIVE: '/api/v1/live',
  LIVE_LIST: (status: string, sortType: string) =>
    `/api/v1/live?status=${status}&sortType=${sortType}`,
  LIVE_ENTER_TOKEN: (liveSeq: number, isHost: boolean) =>
    `/api/v1/live/${liveSeq}/token?isHost=${isHost}`,
  LIVE_LIKE: (liveSeq: number) => `/api/v1/live/${liveSeq}/like`,
  LIVE_EXIT: (liveSeq: number) => `/api/v1/live/${liveSeq}/leave`,
  LIVE_END: (liveSeq: number) => `/api/v1/live/${liveSeq}/end`,
  LIVE_INFO_SEARCH: (liveSeq: number) => `/api/v1/live/${liveSeq}`,
  LIVE_CHAT_HISTORY: (liveSeq: number) => `/api/v1/live/${liveSeq}/chat`,

  //마이페이지
  MYPAGE_PROPERTY: '/api/v1/my/properties',
  MYPAGE_BROKERAGE: '/api/v1/my/brokerage',
  MYPAGE_AUCTION: '/api/v1/my/auctions',
} as const

export const API_TIMEOUT = 10000 // 10초
