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
 * 에러 응답 타입
 */
interface ErrorResponse {
  message: string
  status: number
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
 */
export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const result = await authFetch.get<ApiResponse<User>>(API_ENDPOINTS.USER_INFO)
    console.log('사용자 정보', result.data)
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
 * @param params 이름, 생년월일, 휴대폰 번호
 * @returns 성공 여부
 * @throws Error 인증번호 발송 실패 시
 */
export async function requestPhoneVerification(
  params: PhoneVerificationRequest
): Promise<{ success: boolean; message?: string }> {
  try {
    console.log('=== 휴대폰 인증번호 요청 ===')
    console.log('파라미터:', params)

    const result = await authFetch.post<UserVerifyResponse>(API_ENDPOINTS.PHONE_VERIFY, params)

    console.log('=== 휴대폰 인증번호 요청 성공 ===')
    console.log('응답:', result)

    return {
      success: true,
      message: '인증번호가 발송되었습니다.',
    }
  } catch (error) {
    console.error('=== 휴대폰 인증번호 요청 실패 ===')
    console.error('에러:', error)

    const errorMessage =
      error instanceof Error ? error.message : '인증번호 발송에 실패했습니다.'

    throw new Error(errorMessage)
  }
}

/**
 * 휴대폰 인증번호 확인
 * @param params 인증번호
 * @returns 성공 여부
 * @throws Error 인증번호 확인 실패 시
 */
export async function verifyPhoneCode(
  params: PhoneVerificationCodeRequest
): Promise<{ success: boolean; message?: string }> {
  try {
    console.log('=== 휴대폰 인증번호 확인 ===')
    console.log('인증번호:', params.code)

    const result = await authFetch.post<UserVerifyResponse>(
      API_ENDPOINTS.PHONE_VERIFY_CHECK,
      params
    )

    console.log('=== 휴대폰 인증번호 확인 성공 ===')
    console.log('응답:', result)

    return {
      success: true,
      message: '휴대폰 인증이 완료되었습니다.',
    }
  } catch (error) {
    console.error('=== 휴대폰 인증번호 확인 실패 ===')
    console.error('에러:', error)

    const errorMessage =
      error instanceof Error ? error.message : '인증번호가 일치하지 않습니다.'

    throw new Error(errorMessage)
  }
}

/**
 * 사업자 인증
 * @param params 사업자등록번호
 * @returns 성공 여부
 * @throws Error 사업자 인증 실패 시
 */
export async function verifyBusiness(
  params: BusinessVerificationRequest
): Promise<{ success: boolean; message?: string }> {
  try {
    console.log('=== 사업자 인증 요청 ===')
    console.log('엔드포인트:', API_ENDPOINTS.BUSSINESS_REGISTER)
    console.log('사업자번호:', params.taxSeq)
    console.log('사업자번호 길이:', params.taxSeq.length)

    const result = await authFetch.post<UserVerifyResponse>(
      API_ENDPOINTS.BUSSINESS_REGISTER,
      params
    )

    console.log('=== 사업자 인증 성공 ===')
    console.log('응답:', result)

    return {
      success: true,
      message: '사업자 인증이 완료되었습니다.',
    }
  } catch (error) {
    console.error('=== 사업자 인증 실패 ===')
    console.error('에러:', error)

    const errorMessage =
      error instanceof Error ? error.message : '사업자 인증 중 오류가 발생했습니다.'

    throw new Error(errorMessage)
  }
}
