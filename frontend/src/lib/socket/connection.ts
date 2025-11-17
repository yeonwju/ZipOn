import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

import { StompClientState } from './state'

/**
 * WebSocket 연결 관리
 */

/**
 * WebSocket 연결
 */
export function connectWS(authToken: string | null): Promise<void> {
  return new Promise((resolve, reject) => {
    // 이미 연결되어 있으면 즉시 resolve
    const stompClient = StompClientState.stompClient
    if (stompClient && stompClient.connected) {
      console.log('✅ STOMP 이미 연결되어 있음')
      resolve()
      return
    }

    // 연결 중이면 대기
    if (StompClientState.isConnecting()) {
      console.log('⏳ STOMP 연결 중...')
      // 연결 완료를 기다림 (최대 5초)
      const checkInterval = setInterval(() => {
        const currentClient = StompClientState.stompClient
        if (currentClient && currentClient.connected) {
          clearInterval(checkInterval)
          resolve()
        }
      }, 100)

      setTimeout(() => {
        clearInterval(checkInterval)
        reject(new Error('연결 시간 초과'))
      }, 5000)
      return
    }

    if (!authToken) {
      StompClientState.setIsConnecting(false)
      return reject(new Error('인증 토큰이 필요합니다'))
    }

    StompClientState.setIsConnecting(true)

    const socketConnectUrl = process.env.NEXT_PUBLIC_SOCKET_URL
    if (!socketConnectUrl) {
      StompClientState.setIsConnecting(false)
      return reject(new Error('NEXT_PUBLIC_SOCKET_URL is not defined'))
    }

    // 연결 헤더에 토큰 포함
    const connectHeaders: Record<string, string> = {
      Authorization: `Bearer ${authToken}`,
    }

    console.log('🔑 연결 헤더에 토큰 포함 (길이):', authToken.length)

    const socket = new SockJS(socketConnectUrl)

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: msg => console.log('[STOMP]', msg),
      connectHeaders, // STOMP CONNECT 프레임에 헤더 포함

      onConnect: () => {
        StompClientState.setIsConnecting(false)
        console.log('🟢 STOMP Connected!')
        resolve()
      },

      onStompError: frame => {
        StompClientState.setIsConnecting(false)
        console.error('❌ STOMP Error:', frame)
        reject(frame)
      },
    })

    StompClientState.setStompClient(client)
    client.activate()
  })
}

/**
 * WebSocket 연결 종료
 */
export function disconnectWS() {
  const {
    stompClient,
    activeSubscriptions,
    activeChatSubscriptions,
    activeLiveSubscriptions,
  } = StompClientState

  try {
    // 모든 구독 해제
    activeSubscriptions.forEach(subscription => {
      subscription.unsubscribe()
    })
    activeSubscriptions.clear()

    activeChatSubscriptions.forEach(subscription => {
      subscription.unsubscribe()
    })
    activeChatSubscriptions.clear()

    activeLiveSubscriptions.forEach(subscription => {
      subscription.unsubscribe()
    })
    activeLiveSubscriptions.clear()

    stompClient?.deactivate()
  } finally {
    StompClientState.setStompClient(null)
    StompClientState.setIsConnecting(false)
  }
}

