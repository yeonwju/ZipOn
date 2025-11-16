/**
 * 인증 토큰 관련 유틸리티
 */

/**
 * 클라이언트 사이드에서 쿠키에서 액세스 토큰 가져오기
 */
export function getAccessTokenFromCookie(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    // 쿠키에서 AT 값 가져오기
    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
      const trimmed = cookie.trim()
      const [name, value] = trimmed.split('=')
      if (name === 'AT' && value) {
        // URL 디코딩 (값이 있는 경우만)
        return decodeURIComponent(value)
      }
    }

    // 디버깅: 쿠키가 있는지 확인
    if (process.env.NODE_ENV === 'development') {
      console.warn('[getAccessTokenFromCookie] AT 쿠키를 찾을 수 없습니다.')
      console.log('[getAccessTokenFromCookie] 현재 쿠키:', document.cookie)
    }

    return null
  } catch (error) {
    console.error('[getAccessTokenFromCookie] 쿠키 읽기 실패:', error)
    return null
  }
}

