'use client'

import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import { AuthGuard } from '@/components/auth'
import {
  LiveBroadcast,
  LiveChatContainer,
  LiveHeader,
  LiveHostInfo,
  LiveInteraction,
} from '@/components/features/live'
import { LiveStatsUpdate } from '@/lib/socket/types'
import { useGetLiveInfo } from '@/queries/useLive'
import { useUser } from '@/queries/useUser'
import { getLiveEnterToken, leaveLive } from '@/services/liveService'
import { useMiniPlayerStore } from '@/store/miniPlayer'

interface OnAirPageClientProps {
  authToken: string | null
}

export default function OnAirPageClient({ authToken: initialAuthToken }: OnAirPageClientProps) {
  const router = useRouter()
  const { activateMiniPlayer } = useMiniPlayerStore()

  const { id } = useParams()
  const liveSeq = Number(id)

  const tokenRequestedRef = useRef(false)
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [tokenLoading, setTokenLoading] = useState(false)
  const [tokenError, setTokenError] = useState(false)

  // 통계 상태 관리
  const [viewers, setViewers] = useState(0)
  const [likes, setLikes] = useState(0)

  // 1) 기본 데이터
  const { data: user, isLoading: userLoading } = useUser()
  const {
    data: liveInfo,
    isLoading: liveInfoLoading,
    isError: liveInfoError,
  } = useGetLiveInfo(liveSeq)

  // 2) isHost 계산
  const isHost = !!(user?.userSeq && liveInfo?.host?.userSeq === user?.userSeq)

  // 통계 상태 초기화
  useEffect(() => {
    if (liveInfo) {
      setViewers(liveInfo.viewerCount)
      setLikes(liveInfo.likeCount)
    }
  }, [liveInfo])

  // 통계 업데이트 핸들러
  const handleStatsUpdate = useCallback(
    (update: LiveStatsUpdate) => {
      console.log('[OnAirPageClient] 통계 업데이트 수신:', update)
      switch (update.type) {
        case 'VIEWER_COUNT_UPDATE':
          if (update.count !== undefined) {
            console.log('[OnAirPageClient] 시청자 수 업데이트:', update.count)
            setViewers(update.count)
          }
          break
        case 'CHAT_COUNT_UPDATE':
          // 채팅 수는 LiveChatContainer에서 처리 (여기서는 처리하지 않음)
          console.log('[OnAirPageClient] 채팅 수 업데이트:', update.count)
          break
        case 'LIKE_COUNT_UPDATE':
          if (update.count !== undefined) {
            console.log('[OnAirPageClient] 좋아요 수 업데이트:', update.count)
            setLikes(update.count)
          }
          break
        case 'LIVE_ENDED':
          // 방송 종료 처리
          console.log('[OnAirPageClient] 방송 종료 알림 수신')
          alert('방송이 종료되었습니다.')
          router.push('/live')
          break
        default:
          console.warn('[OnAirPageClient] 알 수 없는 통계 업데이트 타입:', update)
      }
    },
    [router]
  )

  // 뒤로가기 및 페이지 언마운트 시 구독 해제 및 퇴장 처리
  // 호스트는 뒤로가기 허용, 방송 종료는 버튼으로만
  useEffect(() => {
    // 호스트는 뒤로가기 허용 (퇴장 처리 안 함)
    if (isHost) {
      console.log('[OnAirPage] 호스트 모드: 뒤로가기 허용')
      return
    }

    let isLeaving = false

    const handleLeave = async () => {
      if (isLeaving || !liveSeq) return
      isLeaving = true

      try {
        await leaveLive(liveSeq)
        console.log('[OnAirPage] 라이브 퇴장 처리 완료')
      } catch (error) {
        console.error('[OnAirPage] 라이브 퇴장 처리 실패:', error)
        // 에러가 발생해도 계속 진행 (페이지를 닫을 수 있도록)
      }
    }

    // popstate 이벤트 (뒤로가기/앞으로가기) - 시청자만 처리
    const handlePopState = () => {
      handleLeave()
    }

    // beforeunload 이벤트 (페이지 닫기/새로고침) - 시청자만 처리
    const handleBeforeUnload = () => {
      // 비동기 처리가 완료되기 전에 페이지가 닫힐 수 있으므로
      // navigator.sendBeacon 사용 고려 (단, API 엔드포인트가 이를 지원해야 함)
      handleLeave()
    }

    // 이벤트 리스너 등록
    window.addEventListener('popstate', handlePopState)
    window.addEventListener('beforeunload', handleBeforeUnload)

    // cleanup: 컴포넌트 언마운트 시 - 시청자만 처리
    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      // 컴포넌트 언마운트 시 처리
      handleLeave()
    }
  }, [liveSeq, isHost])

  useEffect(() => {
    if (!user?.userSeq) return
    if (!liveInfo) return
    if (tokenRequestedRef.current) return
    if (tokenLoading) return
    if (token) return // 이미 토큰이 있으면 요청하지 않음

    const fetchToken = async () => {
      tokenRequestedRef.current = true
      setTokenLoading(true)
      setTokenError(false)

      try {
        const result = await getLiveEnterToken({ liveSeq, isHost })
        if (result.data?.token) {
          setToken(result.data.token)
        } else {
          setTokenError(true)
        }
      } catch (error) {
        console.error('토큰 발급 실패:', error)
        setTokenError(true)
      } finally {
        setTokenLoading(false)
      }
    }

    fetchToken()
  }, [user?.userSeq, liveInfo, isHost, liveSeq, tokenLoading, token])

  // 5) 콜백
  const handleStreamReady = (stream: MediaStream) => {
    setCurrentStream(stream)
  }

  const handleMinimize = () => {
    if (currentStream) {
      activateMiniPlayer(currentStream.clone())
      router.push('/home')
    }
  }

  // 6) 렌더링

  // 기본 로딩
  if (userLoading || liveInfoLoading) {
    return loadingScreen('방송 정보를 불러오는 중...')
  }

  // live 정보 없음
  if (liveInfoError || !liveInfo) {
    return loadingScreen('방송 정보를 불러올 수 없습니다.')
  }

  // 토큰 요청했지만 아직 안 옴
  if (tokenRequestedRef.current && tokenLoading && !token) {
    return loadingScreen('방송 연결 중...')
  }

  // 토큰 요청 끝났는데 token이 없음 → 실패
  if (tokenRequestedRef.current && !token && !tokenLoading && tokenError) {
    return loadingScreen('토큰 발급에 실패했습니다.')
  }

  // 🔥 방송 화면 렌더링
  if (token) {
    return (
      <AuthGuard>
        <main className="relative h-screen overflow-hidden bg-black">
          <LiveBroadcast token={token} isHost={!!isHost} onStreamReady={handleStreamReady} />

          <LiveHeader onMinimize={handleMinimize} />

          <LiveHostInfo
            title={liveInfo.title}
            hostName={liveInfo.host.name}
            hostProfileImage={liveInfo.host.profileImg}
            interaction={
              <LiveInteraction
                viewers={viewers}
                likes={likes}
                liveSeq={liveSeq}
                liked={liveInfo.liked}
                onStatsUpdate={handleStatsUpdate}
              />
            }
          />

          <LiveChatContainer
            isHost={!!isHost}
            userName={user?.name ?? '사용자'}
            liveSeq={liveSeq}
            hostSeq={liveInfo.host.userSeq}
            authToken={initialAuthToken}
            onStatsUpdate={handleStatsUpdate}
          />
        </main>
      </AuthGuard>
    )
  }

  // fallback
  return loadingScreen('방송 준비 중...')
}

function loadingScreen(text: string) {
  return (
    <AuthGuard>
      <div className="flex h-screen w-screen items-center justify-center bg-black">
        <p className="text-white">{text}</p>
      </div>
    </AuthGuard>
  )
}
