import { Client, StompSubscription } from '@stomp/stompjs'

/**
 * WebSocket 클라이언트 상태 관리
 */

let stompClient: Client | null = null
let isConnectingState = false
const activeSubscriptions = new Map<string, StompSubscription>()
const activeChatSubscriptions = new Map<number, StompSubscription>()
const activeLiveSubscriptions = new Map<number, StompSubscription>()
const activeLiveBroadcastSubscription = new Map<string, StompSubscription>()

/**
 * STOMP 클라이언트 상태 관리 모듈
 */
export const StompClientState = {
  get stompClient() {
    return stompClient
  },

  isConnecting() {
    return isConnectingState
  },

  get activeSubscriptions() {
    return activeSubscriptions
  },

  get activeChatSubscriptions() {
    return activeChatSubscriptions
  },

  get activeLiveSubscriptions() {
    return activeLiveSubscriptions
  },

  get activeLiveBroadcastSubscription() {
    return activeLiveBroadcastSubscription
  },

  setStompClient(client: Client | null) {
    stompClient = client
  },

  setIsConnecting(connecting: boolean) {
    isConnectingState = connecting
  },
}

