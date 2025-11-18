import { API_ENDPOINTS } from '@/constants'
import { authFetch } from '@/lib/fetch'
import { User } from '@/types/models/user'

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
 * 휴대폰 인증 요청 파라미터
 */
export interface PhoneVerificationRequest {
  name: string
  birth: string
  tel: string
}

/**
 * 휴대폰 인증번호 확인 파라미터
 */
export interface PhoneVerificationCodeRequest {
  code: string
}

/**
 * 사업자 인증 요청 파라미터
 */
export interface BusinessVerificationRequest {
  taxSeq: string
}

/**
 * 현재 로그인한 사용자 정보 가져오기
 *
 * React Query에서 사용되므로 에러 발생 시 null 반환
 * (로그아웃 상태로 처리됨)
 */
export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const result = await authFetch.get<ApiResponse<User>>(API_ENDPOINTS.USER_INFO)
    // 개발 환경에서만 로그 출력
    if (process.env.NODE_ENV === 'development') {
      console.log('사용자 정보', result.data)
    }
    return result.data
  } catch (error) {
    // 개발 환경에서는 경고만 표시 (백엔드 서버 없을 수 있음)
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ [개발 모드] 백엔드 API 서버 연결 실패 - 로그아웃 상태로 처리됨')
    } else {
      // 운영 환경에서는 에러 로그
      console.error('[authService] 사용자 정보 가져오기 실패:', error)
    }
    return null
  }
}

/**
 * 휴대폰 인증번호 요청
 */
export async function requestPhoneVerification(params: PhoneVerificationRequest) {
  return authFetch.post<UserVerifyResponse>(API_ENDPOINTS.PHONE_VERIFY, params)
}

/**
 * 휴대폰 인증번호 확인
 */
export async function verifyPhoneCode(params: PhoneVerificationCodeRequest) {
  return authFetch.post<UserVerifyResponse>(API_ENDPOINTS.PHONE_VERIFY_CHECK, params)
}

/**
 * 사업자 인증
 */
export async function verifyBusiness(params: BusinessVerificationRequest) {
  return authFetch.post<UserVerifyResponse>(API_ENDPOINTS.BUSSINESS_REGISTER, params)
}
