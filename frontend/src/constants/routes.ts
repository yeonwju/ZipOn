/**
 * 애플리케이션 라우트 경로 상수
 */

export const ROUTES = {
  // 메인 탭
  HOME: '/home',
  MAP: '/map',
  LISTINGS: '/listings',
  LIVE: '/live/list',
  MYPAGE: '/mypage',
  NOTIFICATION: '/notification',

  // 매물
  LISTING_DETAIL: (id: number | string) => `/listings/${id}`,
  LISTING_NEW: '/listings/new', //매물 등록

  // 라이브
  LIVE_LIST: '/live',
  LIVE_CREATE: '/live/create',

  // 경매
  AUCTION_LIST: '/auctions/list',

  // 마이페이지
  MY_LISTINGS: '/mypage/my-listings',
  MY_AUCTIONS_HISTORY: '/mypage/my-auction',
  // 기타
  CALENDAR: '/calendar',
  LIKE: '/like',
} as const

export type RouteKey = keyof typeof ROUTES
