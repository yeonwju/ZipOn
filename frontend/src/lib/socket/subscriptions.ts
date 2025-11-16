import { IMessage, StompSubscription } from '@stomp/stompjs'

import { StompClientState } from './state'
import {
  ChatMessage,
  ChatNotification,
  LiveChatMessage,
  LiveStartNotification,
  LiveStatsUpdate,
} from './types'

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

/**
 * 라이브 방송 구독 (채팅 + 통계)
 * @param liveSeq 라이브 방송 시퀀스
 * @param onChatMessage 채팅 메시지 콜백
 * @param onStatsUpdate 통계 업데이트 콜백 (시청자 수, 채팅 수, 좋아요 수, 방송 종료)
 */
export function subscribeLive(
  liveSeq: number,
  onChatMessage: (msg: LiveChatMessage) => void,
  onStatsUpdate: (update: LiveStatsUpdate) => void
): StompSubscription | undefined {
  const { stompClient, activeLiveSubscriptions } = StompClientState

  if (!stompClient || !stompClient.connected) {
    console.warn('STOMP 연결할 수 없습니다.')
    return
  }

  const subscriptionKey = `live-${liveSeq}`

  // 이미 구독 중이면 기존 구독 해제 후 새로 구독 (콜백 업데이트를 위해)
  if (activeLiveSubscriptions.has(liveSeq)) {
    console.log('🔄 기존 라이브 방송 구독 해제 후 재구독:', subscriptionKey)
    const existingSubscription = activeLiveSubscriptions.get(liveSeq)
    if (existingSubscription) {
      existingSubscription.unsubscribe()
      activeLiveSubscriptions.delete(liveSeq)
    }
  }

  const subscription = stompClient.subscribe(`/sub/live/${liveSeq}`, (message: IMessage) => {
    let body: any

    try {
      body = JSON.parse(message.body)
      console.log('📥 라이브 방송 메시지 수신 (raw):', message.body)
      console.log('📥 라이브 방송 메시지 수신 (parsed):', body)
    } catch (err) {
      console.error('❌ 라이브 방송 JSON 파싱 오류:', message.body, err)
      return
    }

    // type 필드가 없으면 채팅 메시지
    if (!('type' in body)) {
      const chatMessage = body as LiveChatMessage
      console.log('💬 라이브 채팅 메시지 수신:', chatMessage)
      try {
        onChatMessage(chatMessage)
      } catch (error) {
        console.error('❌ 채팅 메시지 콜백 처리 오류:', error)
      }
    } else {
      // type 필드가 있으면 통계 업데이트
      const statsUpdate = body as LiveStatsUpdate
      console.log('📊 라이브 통계 업데이트 수신:', statsUpdate)
      try {
        onStatsUpdate(statsUpdate)
      } catch (error) {
        console.error('❌ 통계 업데이트 콜백 처리 오류:', error)
      }
    }
  })

  // 구독 저장
  activeLiveSubscriptions.set(liveSeq, subscription)
  console.log('📌 라이브 방송 구독 등록:', subscriptionKey)

  return subscription
}

/**
 * 라이브 방송 구독 해제
 */
export function unsubscribeLive(liveSeq: number) {
  const { activeLiveSubscriptions } = StompClientState
  const subscription = activeLiveSubscriptions.get(liveSeq)

  if (subscription) {
    subscription.unsubscribe()
    activeLiveSubscriptions.delete(liveSeq)
    console.log('🔌 라이브 방송 구독 해제:', `live-${liveSeq}`)
  }
}

/**
 * 새 라이브 방송 시작 알림 구독 (선택사항)
 * @param callback 새 방송 시작 알림 콜백
 */
export function subscribeLiveBroadcastStart(
  callback: (notification: LiveStartNotification) => void
): StompSubscription | undefined {
  const { stompClient, activeLiveBroadcastSubscription } = StompClientState

  if (!stompClient || !stompClient.connected) {
    console.warn('STOMP 연결할 수 없습니다.')
    return
  }

  const subscriptionKey = 'live-broadcast-start'

  // 이미 구독 중이면 기존 구독 반환
  if (activeLiveBroadcastSubscription.has(subscriptionKey)) {
    console.log('✅ 이미 새 방송 알림 구독 중:', subscriptionKey)
    return activeLiveBroadcastSubscription.get(subscriptionKey)
  }

  const subscription = stompClient.subscribe('/sub/live/new/broadcast', (message: IMessage) => {
    let body: LiveStartNotification

    try {
      body = JSON.parse(message.body)
    } catch (err) {
      console.error('❌ 새 방송 알림 JSON 파싱 오류:', message.body)
      return
    }

    console.log('📺 새 라이브 방송 시작 알림 수신:', body)
    callback(body)
  })

  // 구독 저장
  activeLiveBroadcastSubscription.set(subscriptionKey, subscription)
  console.log('📌 새 방송 알림 구독 등록:', subscriptionKey)

  return subscription
}

/**
 * 새 라이브 방송 시작 알림 구독 해제
 */
export function unsubscribeLiveBroadcastStart() {
  const { activeLiveBroadcastSubscription } = StompClientState
  const subscriptionKey = 'live-broadcast-start'
  const subscription = activeLiveBroadcastSubscription.get(subscriptionKey)

  if (subscription) {
    subscription.unsubscribe()
    activeLiveBroadcastSubscription.delete(subscriptionKey)
    console.log('🔌 새 방송 알림 구독 해제:', subscriptionKey)
  }
}
