import { API_ENDPOINTS } from '@/constants'
import { authFetch } from '@/lib/fetch'
import type { User } from '@/store/user'

/**
 * 인증 관련 API 서비스
 */

/**
 * 백엔드 API 응답 타입
 */
interface ApiResponse<T> {
  data: T
  message: string
  status: number
  timestamp: number
}

/**
 * 현재 로그인한 사용자 정보 가져오기
 */
export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const result = await authFetch.get<ApiResponse<User>>(API_ENDPOINTS.USER_INFO)
    return result.data
  } catch (error) {
    console.error('[authService] 사용자 정보 가져오기 실패:', error)
    return null
  }
}

/**
 * 로그아웃
 */
export async function logout(): Promise<boolean> {
  try {
    //  authFetch.post 사용 (쿠키 자동 포함)
    await authFetch.post('/auth/logout')
    return true
  } catch (error) {
    console.error('Error logging out:', error)
    return false
  }
}
