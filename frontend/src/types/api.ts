/**
 * API 공통 타입 정의
 * 
 * 백엔드 API와 통신할 때 사용하는 타입들을 정의합니다.
 * API 연동 시 이 파일의 타입들을 import하여 사용하세요.
 */

import type { BuildingType, Direction, ListingData, ListingDetailData } from './models/listing'

/**
 * API 공통 응답 래퍼
 */
export interface ApiResponse<T> {
  data: T
  message: string
  status: number
  timestamp: number
}

/**
 * ===========================
 * 매물 관련 API 타입
 * ===========================
 */

/**
 * 매물 목록 조회 응답
 */
export type GetListingsResponse = ApiResponse<ListingData[]>

/**
 * 매물 상세 조회 응답
 */
export type GetListingDetailResponse = ApiResponse<ListingDetailData>

/**
 * 매물 필터링 요청 파라미터
 */
export interface ListingFilterParams {
  // 경매 선호 여부
  isAucPref?: boolean
  
  // 건물 타입
  buildingType?: BuildingType | 'all'
  
  // 가격 필터
  deposit_min?: number
  deposit_max?: number | null
  rent_min?: number
  rent_max?: number | null
  
  // 방 개수
  roomCnt?: string
  
  // 면적 (평수)
  area_min?: number
  area_max?: number | null
  
  // 층수
  floor_min?: number
  floor_max?: number | null
  
  // 방향
  facing?: Direction
  
  // 위치 기반 필터
  latitude?: number
  longitude?: number
  radius?: number // km
  
  // 페이지네이션
  page?: number
  limit?: number
}

/**
 * ===========================
 * 사용자 관련 API 타입
 * ===========================
 */

/**
 * 내 매물 목록 조회 응답
 */
export interface GetMyListingsResponse {
  propertySeq: number
  address: string
  detailAddress: string | null
  deposit: number
  mnRent: number
  isAucPref: boolean
  buildingType: BuildingType
  roomCnt: number
  connectBroker: string | null
}

/**
 * ===========================
 * 인증 관련 API 타입
 * ===========================
 */

/**
 * 로그인 요청
 */
export interface LoginRequest {
  email: string
  password: string
}

/**
 * 로그인 응답
 */
export interface LoginResponse {
  token: string
  user: {
    seq: number
    email: string
    nickname: string | null
    profileImg: string | null
    role: string
  }
}

/**
 * ===========================
 * 경매 관련 API 타입
 * ===========================
 */

/**
 * 경매 정보
 */
export interface AuctionInfo {
  propertySeq: number
  aucAt: string // ISO 8601 format
  aucAvailable: string
  currentBid: number
  participantCount: number
}

/**
 * 경매 참여 요청
 */
export interface JoinAuctionRequest {
  propertySeq: number
  bidAmount: number
}

/**
 * ===========================
 * 채팅 관련 API 타입
 * ===========================
 */

/**
 * 채팅방 목록 조회 응답
 */
export interface ChatRoomListResponse {
  chatRoomSeq: number
  partnerName: string
  partnerProfileImg: string | null
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
}

/**
 * 채팅 메시지 전송 요청
 */
export interface SendMessageRequest {
  chatRoomSeq: number
  message: string
  messageType: 'TEXT' | 'IMAGE' | 'FILE'
}

/**
 * ===========================
 * 알림 관련 API 타입
 * ===========================
 */

/**
 * 알림 목록 조회 응답
 */
export interface NotificationListResponse {
  notificationSeq: number
  type: 'AUCTION' | 'CHAT' | 'BROKER' | 'SYSTEM'
  title: string
  content: string
  isRead: boolean
  createdAt: string
  relatedSeq: number | null // 관련 매물/채팅방 등의 seq
}

