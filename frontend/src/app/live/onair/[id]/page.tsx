'use client'
import { ArrowLeft, Minimize2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import LiveBroadcast from '@/components/features/live/LiveBroadcast'
import { useMiniPlayerStore } from '@/store/miniPlayer'

export default function OnAirPage() {
  const router = useRouter()
  const { activateMiniPlayer } = useMiniPlayerStore()
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null)

  // 스트림이 준비되면 저장
  const handleStreamReady = (stream: MediaStream) => {
    setCurrentStream(stream)
  }

  // 미니 플레이어 모드 활성화
  const handleMinimize = () => {
    if (currentStream) {
      // 스트림을 복제하여 미니 플레이어로 전달
      // 원본 스트림은 페이지 전환 시 정리됨
      const clonedStream = currentStream.clone()
      activateMiniPlayer(clonedStream)
      // 홈으로 이동
      router.push('/home')
    }
  }

  // 뒤로 가기
  const handleGoBack = () => {
    router.back()
  }

  return (
    <main className="flex h-screen flex-col">
      <LiveBroadcast onStreamReady={handleStreamReady} />

      {/* 뒤로 가기 버튼 */}
      <div className="absolute top-0 left-0 cursor-pointer p-3" onClick={handleGoBack}>
        <ArrowLeft size={20} className="text-white drop-shadow-lg" />
      </div>

      {/* 미니 플레이어 활성화 버튼 */}
      <div className="absolute top-0 right-0 cursor-pointer p-3" onClick={handleMinimize}>
        <Minimize2 size={20} className="text-white drop-shadow-lg" />
      </div>

      {/* 프로필 정보 */}
      <div
        className={
          'absolute right-10 bottom-0 left-0 flex h-10 flex-row items-center gap-2 text-white'
        }
      >
        <Image src={'/profile.svg'} alt={'프로필 이미지'} width={30} height={30} />
      </div>
    </main>
  )
}
