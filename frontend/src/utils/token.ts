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

  // 쿠키에서 AT 값 가져오기
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === 'AT') {
      return decodeURIComponent(value)
    }
  }

  return null
}

