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

interface UserApiResponse {
  email: string
  nickname: string | null
  name: string | null
  tel: string | null
  birth: string | null
  profileImg: string | null
  Role: string // "USER" | "BROKER"
}

/**
 * 백엔드 응답을 프론트엔드 User 타입으로 변환
 */
function transformUserResponse(apiUser: UserApiResponse): User {
  return {
    email: apiUser.email,
    nickname: apiUser.nickname,
    name: apiUser.name,
    tel: apiUser.tel,
    birth: apiUser.birth,
    profileImg: apiUser.profileImg,
    role: apiUser.Role,
    socialType: null, // 추후 백엔드에서 제공 시 추가
    isBroker: apiUser.Role === 'BROKER',
    isVerified: false, // 추후 백엔드에서 제공 시 추가 (현재는 기본값 false)
  }
}

/**
 * 현재 로그인한 사용자 정보 가져오기
 */
export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const result = await authFetch.get<ApiResponse<UserApiResponse>>('/user/me')

    console.log('🔵 [authService] API 응답:', result)

    const transformedUser = transformUserResponse(result.data)

    console.log('🟢 [authService] 변환된 User:', transformedUser)

    return transformedUser
  } catch (error) {
    console.error('Error fetching user:', error)
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
