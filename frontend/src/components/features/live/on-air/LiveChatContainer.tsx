'use client'

import { MessageCircle, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { connectWS, sendLiveChat, subscribeLive, unsubscribeLive } from '@/lib/socket'
import { LiveChatMessage, LiveStatsUpdate } from '@/lib/socket/types'
import { useEndLive } from '@/queries/useLive'
import { liveChatList } from '@/services/liveService'
import { getAccessTokenFromCookie } from '@/utils/token'

import LiveChatInput from './LiveChatInput'
import LiveChatList, { ChatMessage } from './LiveChatList'
import LiveEndButton from './LiveEndButton'

interface LiveChatContainerProps {
  isHost?: boolean
  userName: string
  liveSeq: number
  hostSeq?: number
  authToken?: string | null
  onStatsUpdate?: (update: LiveStatsUpdate) => void
}

/**
 * 라이브 채팅 컨테이너
 * - 채팅 목록 + 입력창
 * - 상태 관리
 * - 열기/닫기 기능
 * - WebSocket을 통한 실시간 채팅
 */
export default function LiveChatContainer({
  isHost,
  liveSeq,
  hostSeq,
  authToken: initialAuthToken,
  onStatsUpdate,
}: LiveChatContainerProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)

  // 방송 종료 Mutation
  const endLiveMutation = useEndLive()

  // 채팅 기록 불러오기
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const result = await liveChatList(liveSeq)
        if (result.data) {
          const chatMessages: ChatMessage[] = result.data.map(msg => ({
            id: `${msg.liveSeq}-${msg.senderSeq}-${msg.sentAt}`,
            userName: msg.senderName,
            message: msg.content,
            timestamp: new Date(msg.sentAt),
            isHost: msg.senderSeq === hostSeq,
          }))
          setMessages(chatMessages)
        }
      } catch (error) {
        console.error('채팅 기록 불러오기 실패:', error)
      }
    }

    if (liveSeq) {
      loadChatHistory()
    }
  }, [liveSeq, hostSeq])

  // onStatsUpdate 콜백을 ref로 저장 (의존성 문제 방지)
  const onStatsUpdateRef = useRef(onStatsUpdate)
  useEffect(() => {
    onStatsUpdateRef.current = onStatsUpdate
  }, [onStatsUpdate])

  // WebSocket 연결 및 구독
  useEffect(() => {
    let mounted = true

    const setupWebSocket = async () => {
      // props로 받은 토큰 우선, 없으면 쿠키에서 읽기
      const authToken = initialAuthToken || getAccessTokenFromCookie()
      if (!authToken) {
        console.error('[LiveChatContainer] WebSocket 연결: 인증 토큰이 없습니다.')
        console.log('[LiveChatContainer] initialAuthToken:', initialAuthToken)
        // 토큰이 없어도 계속 시도 (재연결 로직이 있을 수 있음)
        return
      }

      try {
        console.log('[LiveChatContainer] WebSocket 연결 시도 중...')
        // WebSocket 연결
        await connectWS(authToken)
        if (!mounted) {
          console.log('[LiveChatContainer] 컴포넌트 언마운트됨, 연결 취소')
          return
        }

        console.log('[LiveChatContainer] WebSocket 연결 성공')
        setIsConnected(true)

        // 라이브 방송 구독
        const subscription = subscribeLive(
          liveSeq,
          // 채팅 메시지 수신 콜백
          (chatMessage: LiveChatMessage) => {
            if (!mounted) {
              console.log('[LiveChatContainer] 채팅 메시지 수신했으나 컴포넌트 언마운트됨')
              return
            }

            console.log('[LiveChatContainer] 채팅 메시지 수신:', chatMessage)

            try {
              const newMessage: ChatMessage = {
                id: `${chatMessage.liveSeq}-${chatMessage.senderSeq}-${chatMessage.sentAt}`,
                userName: chatMessage.senderName,
                message: chatMessage.content,
                timestamp: new Date(chatMessage.sentAt),
                isHost: chatMessage.senderSeq === hostSeq,
              }

              setMessages(prev => {
                // 중복 메시지 방지
                const exists = prev.some(msg => msg.id === newMessage.id)
                if (exists) {
                  console.log('[LiveChatContainer] 중복 메시지 무시:', newMessage.id)
                  return prev
                }
                console.log('[LiveChatContainer] 새 메시지 추가:', newMessage.id)
                return [...prev, newMessage]
              })
            } catch (error) {
              console.error('[LiveChatContainer] 채팅 메시지 처리 오류:', error)
            }
          },
          // 통계 업데이트 콜백
          (update: LiveStatsUpdate) => {
            if (!mounted) {
              console.log('[LiveChatContainer] 통계 업데이트 수신했으나 컴포넌트 언마운트됨')
              return
            }

            console.log('[LiveChatContainer] 통계 업데이트 수신:', update)
            // 통계 업데이트를 상위 컴포넌트로 전달 (ref를 통해 최신 콜백 사용)
            if (onStatsUpdateRef.current) {
              console.log('[LiveChatContainer] onStatsUpdate 콜백 호출:', update)
              try {
                onStatsUpdateRef.current(update)
              } catch (error) {
                console.error('[LiveChatContainer] onStatsUpdate 콜백 실행 오류:', error)
              }
            } else {
              console.warn('[LiveChatContainer] onStatsUpdate 콜백이 없습니다.')
            }
          }
        )

        if (!subscription) {
          console.error('[LiveChatContainer] 구독 실패')
          setIsConnected(false)
        } else {
          console.log('[LiveChatContainer] 구독 성공:', `/sub/live/${liveSeq}`)
        }
      } catch (error) {
        console.error('[LiveChatContainer] WebSocket 연결 실패:', error)
        if (mounted) {
          setIsConnected(false)
        }
      }
    }

    setupWebSocket()

    return () => {
      console.log('[LiveChatContainer] cleanup: 구독 해제 및 연결 정리')
      mounted = false
      // 구독 해제
      unsubscribeLive(liveSeq)
      setIsConnected(false)
    }
  }, [liveSeq, hostSeq, initialAuthToken])

  const handleEndBroadcast = () => {
    if (!isHost) {
      console.warn('[LiveChatContainer] 호스트가 아닌 사용자는 방송을 종료할 수 없습니다.')
      return
    }

    // 방송 종료 API 호출
    endLiveMutation.mutate(liveSeq, {
      onSuccess: () => {
        console.log('[LiveChatContainer] 방송 종료 성공')
        // useEndLive의 onSuccess에서 이미 /live/list로 이동 처리됨
      },
      onError: error => {
        console.error('[LiveChatContainer] 방송 종료 실패:', error)
        alert('방송 종료에 실패했습니다. 다시 시도해주세요.')
      },
    })
  }

  const handleSendMessage = async (message: string) => {
    // props로 받은 토큰 우선, 없으면 쿠키에서 읽기
    const authToken = initialAuthToken || getAccessTokenFromCookie()
    if (!authToken) {
      console.error('[LiveChatContainer] 메시지 전송: 인증 토큰이 없습니다.')
      alert('인증 토큰이 없습니다. 다시 로그인해주세요.')
      return
    }

    if (!isConnected) {
      console.error('[LiveChatContainer] 메시지 전송: WebSocket이 연결되지 않았습니다.')
      alert('채팅 연결이 끊어졌습니다. 잠시 후 다시 시도해주세요.')
      return
    }

    console.log('[LiveChatContainer] 메시지 전송 시도:', message)

    // WebSocket으로 메시지 전송 (에코로 받은 메시지만 UI에 추가)
    try {
      await sendLiveChat(
        liveSeq,
        {
          content: message,
        },
        authToken
      )
      console.log('[LiveChatContainer] 메시지 전송 성공, 에코 대기 중...')
      // 메시지 전송 후 바로 UI에 추가하지 않음
      // WebSocket에서 에코로 받은 메시지를 UI에 추가
    } catch (error) {
      console.error('[LiveChatContainer] 메시지 전송 실패:', error)
      alert('메시지 전송에 실패했습니다. 다시 시도해주세요.')
    }
  }

  // 채팅이 닫혀있으면 토글 버튼만 표시
  if (!isOpen) {
    return (
      <div className={'absolute bottom-4 z-10 flex w-full flex-row justify-between px-2'}>
        <div>
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 rounded-full bg-black/60 px-4 py-2.5 text-white backdrop-blur-sm transition-all hover:bg-black/80"
          >
            <MessageCircle size={20} />
            <span className="text-sm font-medium">채팅 열기</span>
          </button>
        </div>
        {isHost && (
          <div>
            <LiveEndButton onEnd={handleEndBroadcast} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="absolute right-0 bottom-0 left-0 z-10 flex h-[45%] flex-col">
      {/* 채팅 헤더 */}
      <div className="flex items-center justify-between bg-black/60 px-3 py-2 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <MessageCircle size={18} className="text-white" />
          <span className="text-sm font-semibold text-white">채팅</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="채팅 닫기"
        >
          <X size={18} />
        </button>
      </div>

      {/* 채팅 목록 (스크롤 가능) */}
      <div className="flex-1 overflow-hidden">
        <LiveChatList messages={messages} />
      </div>

      {/* 채팅 입력창 */}
      <div className="bg-gradient-to-t from-black/20 to-transparent backdrop-blur-sm">
        <LiveChatInput onSendMessage={handleSendMessage} disabled={!isConnected} />
        {!isConnected && (
          <div className="px-3 pb-2">
            <p className="text-xs text-yellow-400">채팅 연결 중...</p>
          </div>
        )}
      </div>
    </div>
  )
}
