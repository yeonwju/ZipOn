import { IMessage, StompSubscription } from '@stomp/stompjs'

import { StompClientState } from './state'
import { ChatMessage, ChatNotification } from './types'

/**
 * WebSocket 구독 관리
 */

/**
 * 채팅방 메시지 구독
 */
export function subscribeChat(
  roomSeq: number,
  callback: (msg: ChatMessage) => void
): StompSubscription | undefined {
  const { stompClient, activeChatSubscriptions } = StompClientState

  if (!stompClient || !stompClient.connected) {
    console.warn('STOMP 연결할 수 없습니다.')
    return
  }

  const subscriptionKey = `chat-${roomSeq}`

  // 이미 구독 중이면 기존 구독 해제 후 새로 구독 (콜백 업데이트를 위해)
  if (activeChatSubscriptions.has(roomSeq)) {
    console.log('🔄 기존 채팅방 구독 해제 후 재구독:', subscriptionKey)
    const existingSubscription = activeChatSubscriptions.get(roomSeq)
    if (existingSubscription) {
      existingSubscription.unsubscribe()
      activeChatSubscriptions.delete(roomSeq)
    }
  }

  const subscription = stompClient.subscribe(`/sub/chat/${roomSeq}`, (message: IMessage) => {
    let body: ChatMessage

    try {
      body = JSON.parse(message.body)
    } catch (err) {
      console.error('❌ JSON 파싱 오류:', message.body)
      return
    }

    callback(body)
  })

  // 구독 저장
  activeChatSubscriptions.set(roomSeq, subscription)
  console.log('📌 채팅방 구독 등록:', subscriptionKey)

  return subscription
}

/**
 * 채팅 알림 구독
 */
export function subscribeNotifications(
  userSeq: number,
  callback: (notification: ChatNotification) => void
): StompSubscription | undefined {
  const { stompClient, activeSubscriptions } = StompClientState

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

/**
 * 채팅 알림 구독 해제
 */
export function unsubscribeNotifications(userSeq: number) {
  const { activeSubscriptions } = StompClientState
  const subscriptionKey = `notifications-${userSeq}`
  const subscription = activeSubscriptions.get(subscriptionKey)

  if (subscription) {
    subscription.unsubscribe()
    activeSubscriptions.delete(subscriptionKey)
    console.log('🔌 알림 구독 해제:', subscriptionKey)
  }
}

/**
 * 채팅방 구독 해제
 */
export function unsubscribeChat(roomSeq: number) {
  const { activeChatSubscriptions } = StompClientState
  const subscription = activeChatSubscriptions.get(roomSeq)

  if (subscription) {
    subscription.unsubscribe()
    activeChatSubscriptions.delete(roomSeq)
    console.log('🔌 채팅방 구독 해제:', `chat-${roomSeq}`)
  }
}
