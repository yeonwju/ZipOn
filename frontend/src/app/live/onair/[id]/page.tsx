'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { AuthGuard } from '@/components/auth'
import {
  LiveBroadcast,
  LiveChatContainer,
  LiveHeader,
  LiveHostInfo,
  LiveInteraction,
} from '@/components/features/live'
import { useGetLiveInfo } from '@/hooks/queries/useLive'
import { useUser } from '@/hooks/queries/useUser'
import { getLiveEnterToken } from '@/services/liveService'
import { useMiniPlayerStore } from '@/store/miniPlayer'

export default function OnAirPage() {
  const router = useRouter()
  const { activateMiniPlayer } = useMiniPlayerStore()

  const { id } = useParams()
  const liveSeq = Number(id)

  const tokenRequestedRef = useRef(false)
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [tokenLoading, setTokenLoading] = useState(false)
  const [tokenError, setTokenError] = useState(false)

  // 1) 기본 데이터
  const { data: user, isLoading: userLoading } = useUser()
  const {
    data: liveInfo,
    isLoading: liveInfoLoading,
    isError: liveInfoError,
  } = useGetLiveInfo(liveSeq)

  // 2) isHost 계산
  const isHost = !!(user?.userSeq && liveInfo?.host?.userSeq === user?.userSeq)

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
        const response = await getLiveEnterToken({ liveSeq, isHost })
        if (response.success && response.data?.token) {
          setToken(response.data.token)
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
                initialViewers={liveInfo.viewerCount}
                initialLikes={liveInfo.likeCount}
              />
            }
          />

          <LiveChatContainer isHost={!!isHost} userName={user?.name ?? '사용자'} />
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
