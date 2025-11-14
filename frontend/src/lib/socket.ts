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

let stompClient: Client | null = null

// -----------------------------
//  1. WS 연결
// -----------------------------
export function connectWS(): Promise<void> {
  return new Promise((resolve, reject) => {
    const socketConnectUrl = process.env.NEXT_PUBLIC_SOCKET_URL
    if (!socketConnectUrl) {
      return reject(new Error('NEXT_PUBLIC_SOCKET_URL is not defined'))
    }

    const socket = new SockJS(socketConnectUrl)

    stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: msg => console.log('[STOMP]', msg),

      onConnect: () => {
        console.log('🟢 STOMP Connected!')
        resolve()
      },

      onStompError: frame => {
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
//  3. 연결 종료
// -----------------------------
export function disconnectWS() {
  try {
    stompClient?.deactivate()
  } finally {
    stompClient = null
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
