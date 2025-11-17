'use client'

import { Eye, Heart } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useLikeLive } from '@/queries/useLive'
import { LiveStatsUpdate } from '@/lib/socket/types'

interface LiveInteractionProps {
  viewers?: number
  likes?: number
  liveSeq: number
  liked?: boolean
  onStatsUpdate?: (update: LiveStatsUpdate) => void
}

/**
 * 라이브 인터랙션 컴포넌트
 * - 실시간 시청자 수
 * - 좋아요 버튼 및 수
 * - WebSocket 통계 업데이트 처리
 */
export default function LiveInteraction({
  viewers: viewersProp = 0,
  likes: likesProp = 0,
  liveSeq,
  liked: likedProp = false,
  onStatsUpdate,
}: LiveInteractionProps) {
  // 통계는 props로 받되, 좋아요 상태만 로컬에서 관리 (UX 개선)
  const [isLiked, setIsLiked] = useState(likedProp)
  const [showHeartAnimation, setShowHeartAnimation] = useState(false)

  // 좋아요 Mutation
  const likeLiveMutation = useLikeLive()

  // 좋아요 상태 동기화 (props가 변경될 때마다 업데이트)
  useEffect(() => {
    setIsLiked(likedProp)
  }, [likedProp])

  const handleLike = () => {
    // 좋아요 상태만 즉시 토글 (UX 개선)
    const newLikedState = !isLiked
    setIsLiked(newLikedState)

    if (newLikedState) {
      setShowHeartAnimation(true)
      setTimeout(() => {
        setShowHeartAnimation(false)
      }, 1000)
    }

    // Mutation으로 좋아요 토글
    likeLiveMutation.mutate(liveSeq, {
      onSuccess: result => {
        // API 응답의 실제 상태로 업데이트 (서버가 반환한 최종 상태)
        console.log('[LiveInteraction] 좋아요 토글 성공, 서버 상태:', result.data)
        if (result.data !== undefined) {
          setIsLiked(result.data)
        }
        // WebSocket으로 LIKE_COUNT_UPDATE를 받아서 실제 수를 업데이트
      },
      onError: error => {
        console.error('[LiveInteraction] 좋아요 토글 오류:', error)
        // 실패 시 상태 롤백
        setIsLiked(!newLikedState)
      },
    })
  }

  return (
    <div className="flex items-center gap-2">
      {/* 시청자 수 */}
      <div className="flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 backdrop-blur-sm">
        <Eye size={14} className="text-white" />
        <span className="text-xs font-semibold text-white">{viewersProp.toLocaleString()}</span>
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
            className={`transition-all ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`}
          />
          <span className="text-xs font-semibold text-white">{likesProp.toLocaleString()}</span>
        </button>

        {/* 좋아요 애니메이션 */}
        {showHeartAnimation && (
          <div className="animate-float-up absolute -top-2 left-1/2 -translate-x-1/2">
            <Heart size={24} className="fill-red-500 text-red-500 drop-shadow-lg" />
          </div>
        )}
      </div>
    </div>
  )
}
