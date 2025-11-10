'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import {
  LiveBroadcast,
  LiveChatContainer,
  LiveHeader,
  LiveHostInfo,
  LiveInteraction,
} from '@/components/features/live'
import { useMiniPlayerStore } from '@/store/miniPlayer'

export default function OnAirPage() {
  const router = useRouter()
  const { activateMiniPlayer } = useMiniPlayerStore()
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null)

  // TODO: 실제 사용자 정보로 교체
  const isHost = true // 방송 진행자 여부
  const userName = '변가원' // 현재 사용자 이름

  // 라이브 정보 (TODO: API에서 가져오기)
  const liveInfo = {
    title: '🏠 강남 역삼동 신축 오피스텔 실시간 투어',
    hostName: '변가원',
    hostProfileImage: '/profile.svg',
    viewers: 342,
    likes: 1523,
  }

  // 스트림이 준비되면 저장
  const handleStreamReady = (stream: MediaStream) => {
    setCurrentStream(stream)
  }

  // 미니 플레이어 모드 활성화
  const handleMinimize = () => {
    if (currentStream) {
      const clonedStream = currentStream.clone()
      activateMiniPlayer(clonedStream)
      router.push('/home')
    }
  }

  return (
    <main className="relative h-screen overflow-hidden bg-black">
      {/* 비디오 스트림 배경 */}
      <LiveBroadcast onStreamReady={handleStreamReady} />

      {/* 상단 헤더 (투명) */}
      <LiveHeader onMinimize={handleMinimize} />

      {/* 좌측 상단: 방송 정보 & 진행자 프로필 */}
      <LiveHostInfo
        title={liveInfo.title}
        hostName={liveInfo.hostName}
        hostProfileImage={liveInfo.hostProfileImage}
        interaction={
          <LiveInteraction initialViewers={liveInfo.viewers} initialLikes={liveInfo.likes} />
        }
      />

      {/* 하단: 채팅 영역 */}
      <LiveChatContainer isHost={isHost} userName={userName} />
    </main>
  )
}
