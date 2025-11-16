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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // 에러 처리
  if (liveInfoError || (!liveInfoLoading && !liveInfo)) {
    return (
      <AuthGuard>
        <div className="flex h-screen w-screen items-center justify-center bg-black">
          <div className="text-center">
            <p className="text-white">방송 정보를 불러올 수 없습니다.</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  // 로딩 처리 - liveInfo 또는 토큰 로딩 중
  // tokenLoading이 false이고 tokenResponse가 없으면 아직 요청하지 않은 것
  // tokenLoading이 true이면 요청 중
  // tokenResponse가 있고 token이 없으면 에러 상태
  const isWaitingForToken = liveInfoLoading || tokenLoading || (!token && !tokenResponse)

  if (isWaitingForToken) {
    return (
      <AuthGuard>
        <main className="relative h-screen overflow-hidden bg-black">
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
              </div>
              <p className="text-white">방송 연결 중...</p>
            </div>
          </div>
          {/* liveInfo가 있으면 헤더 정보는 미리 표시 */}
          {liveInfo && (
            <>
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
            </>
          )}
        </main>
      </AuthGuard>
    )
  }

  // 토큰 발급 실패 시
  if (!token && tokenResponse && !tokenResponse.data?.token) {
    return (
      <AuthGuard>
        <div className="flex h-screen w-screen items-center justify-center bg-black">
          <div className="text-center">
            <p className="text-white">방송 연결에 실패했습니다.</p>
            <p className="mt-2 text-sm text-gray-400">토큰 발급에 실패했습니다.</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  // 이 시점에서는 liveInfo와 token이 모두 존재함 (위의 조건문에서 보장)
  if (!liveInfo || !token) {
    return null
  }

  return (
    <AuthGuard>
      <main className="relative h-screen overflow-hidden bg-black">
        <LiveBroadcast token={token} isHost={isHost} onStreamReady={handleStreamReady} />

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
