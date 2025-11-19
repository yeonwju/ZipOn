/**
 * STOMP WebSocket 클라이언트 공통 설정
 * - 백엔드 WebSocket 엔드포인트: ws://localhost:8080/ws
 * - JWT 인증 처리
 */

import { Client, StompConfig } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

const WS_BASE_URL = 'https://dev-zipon.duckdns.org/ws'

/**
 * STOMP 클라이언트 생성 (공통)
 * @param token JWT 토큰
 * @param onConnect 연결 성공 콜백
 * @param onError 에러 콜백
 * @param debug 디버그 모드 (기본: false)
 */
export function createStompClient(
  token: string,
  onConnect: () => void,
  onError: (error: any) => void,
  debug: boolean = false
): Client {
  const config: StompConfig = {
    // SockJS를 사용한 WebSocket 연결 (fallback 지원)
    webSocketFactory: () => new SockJS(WS_BASE_URL) as any,

    // JWT 토큰을 헤더에 포함
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    // 재연결 설정
    reconnectDelay: 5000, // 5초마다 재연결 시도
    heartbeatIncoming: 10000, // 서버 → 클라이언트 heartbeat (10초)
    heartbeatOutgoing: 10000, // 클라이언트 → 서버 heartbeat (10초)

    // 연결 성공
    onConnect: () => {
      console.log('[STOMP] 연결 성공')
      onConnect()
    },

    // 연결 실패 또는 에러
    onStompError: frame => {
      console.error('[STOMP] 에러:', frame.headers['message'])
      console.error('[STOMP] 상세:', frame.body)
      onError(frame)
    },

    // WebSocket 연결 종료
    onWebSocketClose: event => {
      console.log('[STOMP] WebSocket 연결 종료:', event.reason)
    },
  }

  // 디버그 로그 (선택적으로 추가)
  if (debug) {
    config.debug = str => console.log('[STOMP]', str)
  }

  return new Client(config)
}

/**
 * JWT 토큰 가져오기 (클라이언트 사이드에서 쿠키에서 직접 읽기)
 *
 * 쿠키가 HttpOnly가 아닌 경우 클라이언트에서 직접 읽을 수 있습니다.
 */
export async function getAuthToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null

  try {
    // 쿠키에서 직접 토큰 읽기
    const { getAccessTokenFromCookie } = await import('@/utils/token')
    const token = getAccessTokenFromCookie()

    if (!token) {
      console.warn('[getAuthToken] 쿠키에서 토큰을 찾을 수 없습니다.')
      return null
    }

    return token
  } catch (error) {
    console.error('[getAuthToken] 토큰 가져오기 실패:', error)
    return null
  }
}
