'use client'

import { Eye, Heart } from 'lucide-react'
import { useState } from 'react'

interface LiveInteractionProps {
  initialViewers?: number
  initialLikes?: number
}

/**
 * 라이브 인터랙션 컴포넌트
 * - 실시간 시청자 수
 * - 좋아요 버튼 및 수
 */
export default function LiveInteraction({
  initialViewers = 0,
  initialLikes = 0,
}: LiveInteractionProps) {
  const [viewers] = useState(initialViewers)
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(false)
  const [showHeartAnimation, setShowHeartAnimation] = useState(false)

  const handleLike = () => {
    if (isLiked) {
      // 좋아요 취소 (즉시)
      setLikes(prev => prev - 1)
      setIsLiked(false)
    } else {
      // 좋아요 추가
      setLikes(prev => prev + 1)
      setIsLiked(true)
      setShowHeartAnimation(true)

      // 애니메이션 후 초기화
      setTimeout(() => {
        setShowHeartAnimation(false)
      }, 1000)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* 시청자 수 */}
      <div className="flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 backdrop-blur-sm">
        <Eye size={14} className="text-white" />
        <span className="text-xs font-semibold text-white">
          {viewers.toLocaleString()}
        </span>
      </div>

      {/* 좋아요 버튼 */}
      <div className="relative">
        <button
          onClick={handleLike}
          className="flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
          aria-label={isLiked ? '좋아요 취소' : '좋아요'}
        >
          <Heart
            size={14}
            className={`transition-all ${
              isLiked ? 'fill-red-500 text-red-500' : 'text-white'
            }`}
          />
          <span className="text-xs font-semibold text-white">
            {likes.toLocaleString()}
          </span>
        </button>

        {/* 좋아요 애니메이션 */}
        {showHeartAnimation && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 animate-float-up">
            <Heart size={24} className="fill-red-500 text-red-500 drop-shadow-lg" />
          </div>
        )}
      </div>
    </div>
  )
}

