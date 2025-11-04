/**
 * 사용자 도메인 모델
 */

/**
 * 사용자 정보
 */
export interface User {
  id: number
  email: string
  name: string
  phone?: string
  profileImage?: string
  role: 'user' | 'broker' | 'admin'
  createdAt: string
}

/**
 * 사용자 프로필
 */
export interface UserProfile extends User {
  likedListings: number[]
  viewedListings: number[]
}

