/**
 * ReactQuery Query Keys 관리
 *
 * 모든 Query Key를 한 곳에서 관리하여 일관성을 유지합니다.
 * - 캐시 무효화 시 오타 방지
 * - Query Key 구조 한눈에 파악
 * - 타입 안정성 보장
 */

/**
 * 사용자 관련 Query Keys
 */
export const userQueryKeys = {
  /**
   * 모든 사용자 관련 쿼리
   */
  all: ['user'] as const,

  /**
   * 현재 로그인한 사용자 정보
   */
  me: () => [...userQueryKeys.all, 'me'] as const,

  /**
   * 특정 사용자 프로필 (id로 조회)
   */
  profile: (userId: number) => [...userQueryKeys.all, 'profile', userId] as const,
} as const

/**
 * 매물 관련 Query Keys
 */
export const listingQueryKeys = {
  all: ['listing'] as const,
  lists: () => [...listingQueryKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...listingQueryKeys.lists(), filters] as const,
  details: () => [...listingQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...listingQueryKeys.details(), id] as const,
} as const

/**
 * 브로커 관련 Query Keys
 */
export const brokerQueryKeys = {
  all: ['broker'] as const,
  lists: (propertySeq: number) => [...brokerQueryKeys.all, 'list', propertySeq] as const,
  details: () => [...brokerQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...brokerQueryKeys.details(), id] as const,
}

/**
 * 경매 관련 Query Keys (향후 사용)
 */
export const auctionQueryKeys = {
  all: ['auction'] as const,
  lists: () => [...auctionQueryKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...auctionQueryKeys.lists(), filters] as const,
  details: () => [...auctionQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...auctionQueryKeys.details(), id] as const,
  bidHistory: (auctionId: number) => [...auctionQueryKeys.all, 'bidHistory', auctionId] as const,
} as const

/**
 * 라이브 관련 Query Keys (향후 사용)
 */
export const liveQueryKeys = {
  all: ['live'] as const,
  lists: () => [...liveQueryKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...liveQueryKeys.lists(), filters] as const,
  details: () => [...liveQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...liveQueryKeys.details(), id] as const,
} as const

/**
 * 채팅 관련 Query Keys (향후 사용)
 */
export const chatQueryKeys = {
  all: ['chat'] as const,
  rooms: () => [...chatQueryKeys.all, 'rooms'] as const,
  room: (roomId: number) => [...chatQueryKeys.all, 'room', roomId] as const,
  messages: (roomId: number) => [...chatQueryKeys.all, 'messages', roomId] as const,
} as const

/**
 * 알림 관련 Query Keys (향후 사용)
 */
export const notificationQueryKeys = {
  all: ['notification'] as const,
  lists: () => [...notificationQueryKeys.all, 'list'] as const,
  unreadCount: () => [...notificationQueryKeys.all, 'unreadCount'] as const,
} as const

/**
 * 전체 Query Keys Export
 */
export const queryKeys = {
  user: userQueryKeys,
  listing: listingQueryKeys,
  auction: auctionQueryKeys,
  live: liveQueryKeys,
  chat: chatQueryKeys,
  notification: notificationQueryKeys,
} as const
