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
import { useGetLiveEnterToken, useGetLiveInfo } from '@/hooks/queries/useLive'
import { useUser } from '@/hooks/queries/useUser'
import { useMiniPlayerStore } from '@/store/miniPlayer'

export default function OnAirPage() {
  const router = useRouter()
  const { activateMiniPlayer } = useMiniPlayerStore()
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null)
  const tokenRequestedRef = useRef(false)

  const { id } = useParams() as { id: string }
  const liveSeq = Number(id)

  const { data: user } = useUser()
  const {
    data: liveInfo,
    isLoading: liveInfoLoading,
    isError: liveInfoError,
  } = useGetLiveInfo(liveSeq)

  const {
    mutate: requestToken,
    data: tokenResponse,
    isPending: tokenLoading,
  } = useGetLiveEnterToken()

  const isHost = user?.userSeq !== undefined && liveInfo?.host?.userSeq === user?.userSeq

  // 토큰 요청 (단 1회만 실행)
  useEffect(() => {
    // 필수 조건 확인
    if (!user?.userSeq || !liveInfo) return

    // 이미 토큰 요청을 했으면 다시 요청하지 않음
    if (tokenRequestedRef.current) return

    // 토큰이 이미 발급되었으면 요청하지 않음
    if (tokenResponse?.data?.token) {
      tokenRequestedRef.current = true
      return
    }

    // 토큰 요청 중이면 요청하지 않음
    if (tokenLoading) return

    // 토큰 요청 실행
    tokenRequestedRef.current = true
    requestToken({
      liveSeq,
      isHost,
    })
  }, [user?.userSeq, liveInfo?.liveSeq, isHost])

  const token = tokenResponse?.data?.token ?? null

  const handleStreamReady = (stream: MediaStream) => {
    setCurrentStream(stream)
  }

  const handleMinimize = () => {
    if (currentStream) {
      activateMiniPlayer(currentStream.clone())
      router.push('/home')
    }
  }

  // 로딩 처리
  if (liveInfoLoading || tokenLoading) {
    return (
      <AuthGuard>
        <div className="p-4 text-white">방송 연결 중...</div>
      </AuthGuard>
    )
  }

  if (liveInfoError || !liveInfo) {
    return (
      <AuthGuard>
        <div className="p-4 text-white">방송 정보를 불러올 수 없습니다.</div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <main className="relative h-screen overflow-hidden bg-black">
        {token && <LiveBroadcast token={token} isHost={isHost} onStreamReady={handleStreamReady} />}

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

        <LiveChatContainer isHost={isHost} userName={user?.name ?? '사용자'} />
      </main>
    </AuthGuard>
  )
}
