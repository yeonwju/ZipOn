'use client'

import { ArrowLeft, Minimize2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface LiveHeaderProps {
  onMinimize: () => void
}

/**
 * 라이브 상단 헤더 (투명 배경)
 * - 뒤로가기 버튼
 * - 미니 플레이어 버튼
 */
export default function LiveHeader({ onMinimize }: LiveHeaderProps) {
  const router = useRouter()
  const handleGoBack = () => {
    router.back()
  }
  return (
    <div className="absolute top-0 right-0 left-0 z-20 flex items-center justify-between p-3">
      {/* 뒤로 가기 */}
      <button
        onClick={handleGoBack}
        className="flex items-center justify-center rounded-full bg-black/30 p-2 backdrop-blur-sm transition-all hover:bg-black/50"
        aria-label="뒤로 가기"
      >
        <ArrowLeft size={20} className="text-white" />
      </button>

      {/* 미니 플레이어 */}
      <button
        onClick={onMinimize}
        className="flex items-center justify-center rounded-full bg-black/30 p-2 backdrop-blur-sm transition-all hover:bg-black/50"
        aria-label="미니 플레이어"
      >
        <Minimize2 size={20} className="text-white" />
      </button>
    </div>
  )
}
