/**
 * API 엔드포인트 상수
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export const API_ENDPOINTS = {
  // 매물
  LISTINGS: '/api/listings',
  LISTING_BY_ID: (id: number | string) => `/api/listings/${id}`,
  LISTING_CREATE: '/api/listings',

  // 라이브
  LIVE: '/api/live',
  LIVE_BY_ID: (id: number | string) => `/api/live/${id}`,
  LIVE_CREATE: '/api/live',

  // 사용자
  USER_PROFILE: '/api/user/profile',
  USER_LIKES: '/api/user/likes',

  // 업로드
  UPLOAD_IMAGE: '/api/upload/image',
  UPLOAD_FILE: '/api/upload/file',
} as const

export const API_TIMEOUT = 10000 // 10초

