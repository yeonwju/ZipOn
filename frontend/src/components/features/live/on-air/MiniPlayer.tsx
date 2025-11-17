'use client'

import { Maximize2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import { useMiniPlayerStore } from '@/store/miniPlayer'

export default function MiniPlayer() {
  const router = useRouter()
  const { isActive, stream, position, deactivateMiniPlayer, updatePosition } = useMiniPlayerStore()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // 비디오 스트림 설정
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  // 드래그 시작
  const handleMouseDown = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      setIsDragging(true)
    }
  }

  // 드래그 중
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x
        const newY = e.clientY - dragOffset.y

        // 화면 밖으로 나가지 않도록 제한
        const maxX = window.innerWidth - 280 // 미니 플레이어 너비
        const maxY = window.innerHeight - 200 // 미니 플레이어 높이

        const boundedX = Math.max(0, Math.min(newX, maxX))
        const boundedY = Math.max(0, Math.min(newY, maxY))

        updatePosition(boundedX, boundedY)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset, updatePosition])

  // 터치 이벤트 처리 (모바일)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const touch = e.touches[0]
      setDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      })
      setIsDragging(true)
    }
  }

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length > 0) {
        e.preventDefault()
        const touch = e.touches[0]
        const newX = touch.clientX - dragOffset.x
        const newY = touch.clientY - dragOffset.y

        const maxX = window.innerWidth - 280
        const maxY = window.innerHeight - 200

        const boundedX = Math.max(0, Math.min(newX, maxX))
        const boundedY = Math.max(0, Math.min(newY, maxY))

        updatePosition(boundedX, boundedY)
      }
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
    }

    return () => {
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging, dragOffset, updatePosition])

  // 전체 화면으로 돌아가기
  const handleMaximize = () => {
    deactivateMiniPlayer()
    router.push('/live/onair/1') // 라이브 페이지로 이동
  }

  if (!isActive || !stream) return null

  return (
    <div
      ref={containerRef}
      className="fixed z-50 overflow-hidden rounded-lg border-2 border-white shadow-2xl"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '280px',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* 컨트롤 바 */}
      <div className="absolute top-0 right-0 left-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent p-2">
        <button
          onClick={e => {
            e.stopPropagation()
            handleMaximize()
          }}
          className="rounded-full bg-white/20 p-1.5 transition-colors hover:bg-white/30"
        >
          <Maximize2 size={16} className="text-white" />
        </button>
        <button
          onClick={e => {
            e.stopPropagation()
            deactivateMiniPlayer()
          }}
          className="rounded-full bg-white/20 p-1.5 transition-colors hover:bg-red-500/70"
        >
          <X size={16} className="text-white" />
        </button>
      </div>

      {/* 비디오 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="aspect-video h-auto w-full bg-black object-cover"
      />

      {/* 라이브 뱃지 */}
      <div className="absolute bottom-2 left-2 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
        LIVE
      </div>
    </div>
  )
}
