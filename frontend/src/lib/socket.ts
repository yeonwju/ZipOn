import { Client, IMessage, StompSubscription } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

// -----------------------------
//  서버에서 내려주는 메시지
// -----------------------------
export interface ChatMessage {
  messageSeq: number
  roomSeq: number
  sender: {
    userSeq: number
    name: string
    nickname: string
    profileImg: string
  }
  content: string
  sentAt: string
}

// -----------------------------
//  서버로 보내는 메시지 (보낼 때는 DTO 작음)
// -----------------------------
export interface ChatMessageRequest {
  content: string
  type?: string
}

// -----------------------------
//  채팅 알림 메시지
// -----------------------------
export interface ChatNotification {
  roomSeq: number
  sender: {
    userSeq: number
    name: string
    nickname: string
    profileImg: string
  }
  content: string
  sentAt: string
  unreadCount: number
}

let stompClient: Client | null = null
let isConnecting = false
const activeSubscriptions = new Map<string, StompSubscription>()

// -----------------------------
//  1. WS 연결
// -----------------------------
export function connectWS(): Promise<void> {
  return new Promise((resolve, reject) => {
    // 이미 연결되어 있으면 즉시 resolve
    if (stompClient && stompClient.connected) {
      console.log('✅ STOMP 이미 연결되어 있음')
      resolve()
      return
    }

    // 연결 중이면 대기
    if (isConnecting) {
      console.log('⏳ STOMP 연결 중...')
      // 연결 완료를 기다림 (최대 5초)
      const checkInterval = setInterval(() => {
        if (stompClient && stompClient.connected) {
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

    isConnecting = true

    const socketConnectUrl = process.env.NEXT_PUBLIC_SOCKET_URL
    if (!socketConnectUrl) {
      isConnecting = false
      return reject(new Error('NEXT_PUBLIC_SOCKET_URL is not defined'))
    }

    const socket = new SockJS(socketConnectUrl)

    stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: msg => console.log('[STOMP]', msg),

      onConnect: () => {
        isConnecting = false
        console.log('🟢 STOMP Connected!')
        resolve()
      },

      onStompError: frame => {
        isConnecting = false
        console.error('❌ STOMP Error:', frame)
        reject(frame)
      },
    })

    stompClient.activate()
  })
}

// -----------------------------
//  2. 구독
// -----------------------------
export function subscribeChat(
  roomSeq: number,
  callback: (msg: ChatMessage) => void
): StompSubscription | undefined {
  if (!stompClient || !stompClient.connected) {
    console.warn('STOMP 연결할 수 없습니다.')
    return
  }

  return stompClient.subscribe(`/sub/chat/${roomSeq}`, (message: IMessage) => {
    let body: ChatMessage

    try {
      body = JSON.parse(message.body)
    } catch (err) {
      console.error('❌ JSON 파싱 오류:', message.body)
      return
    }

    callback(body)
  })
}

// -----------------------------
//  2-1. 알림 구독
// -----------------------------
export function subscribeNotifications(
  userSeq: number,
  callback: (notification: ChatNotification) => void
): StompSubscription | undefined {
  if (!stompClient || !stompClient.connected) {
    console.warn('STOMP 연결할 수 없습니다.')
    return
  }

  const subscriptionKey = `notifications-${userSeq}`

  // 이미 구독 중이면 기존 구독 반환
  if (activeSubscriptions.has(subscriptionKey)) {
    console.log('✅ 이미 알림 구독 중:', subscriptionKey)
    return activeSubscriptions.get(subscriptionKey)
  }

  const subscription = stompClient.subscribe(
    `/sub/user/notifications/${userSeq}`,
    (message: IMessage) => {
      let body: ChatNotification

      try {
        body = JSON.parse(message.body)
      } catch (err) {
        console.error('❌ 알림 JSON 파싱 오류:', message.body)
        return
      }

      console.log('🔔 채팅 알림 수신:', body)
      callback(body)
    }
  )

  // 구독 저장
  activeSubscriptions.set(subscriptionKey, subscription)
  console.log('📌 알림 구독 등록:', subscriptionKey)

  return subscription
}

// -----------------------------
//  2-2. 구독 해제
// -----------------------------
export function unsubscribeNotifications(userSeq: number) {
  const subscriptionKey = `notifications-${userSeq}`
  const subscription = activeSubscriptions.get(subscriptionKey)

  if (subscription) {
    subscription.unsubscribe()
    activeSubscriptions.delete(subscriptionKey)
    console.log('🔌 알림 구독 해제:', subscriptionKey)
  }
}

// -----------------------------
//  3. 연결 종료
// -----------------------------
export function disconnectWS() {
  try {
    // 모든 구독 해제
    activeSubscriptions.forEach(subscription => {
      subscription.unsubscribe()
    })
    activeSubscriptions.clear()

    stompClient?.deactivate()
  } finally {
    stompClient = null
    isConnecting = false
  }
}

// -----------------------------
//  4. 메시지 전송
// -----------------------------
export function sendChat(roomSeq: number, payload: ChatMessageRequest) {
  if (!stompClient || !stompClient.connected) {
    console.warn('STOMP 연결할 수 없습니다.')
    return
  }

  stompClient.publish({
    destination: `/pub/chat/${roomSeq}`,
    body: JSON.stringify(payload),
  })
}
