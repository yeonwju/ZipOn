import React, { useEffect, useRef, useState } from 'react'

import type { SheetState } from './useBottomSheetHeight'

interface UseBottomSheetDragParams {
  dragHandleRef: React.RefObject<HTMLDivElement | null>
  sheetState: SheetState
  setSheetState: (state: SheetState) => void
  onClose: () => void
  hasScroll: boolean
  listingCount: number
}

interface UseBottomSheetDragReturn {
  isDragging: boolean
  dragY: number
  isClosing: boolean
}

/**
 * 바텀 시트의 드래그 동작을 처리하는 훅
 *
 * 마우스 및 터치 이벤트를 처리하여 드래그 상태를 관리합니다.
 * - collapsed에서 위로 드래그: expanded로 전환 (매물 3개 이상, 스크롤 필요 시)
 * - collapsed에서 아래로 드래그: 닫기
 * - expanded에서 아래로 드래그: collapsed로 전환 또는 닫기
 *
 * @param params - 드래그 처리에 필요한 파라미터
 * @returns 드래그 상태 (isDragging, dragY, isClosing)
 *
 * @example
 * ```tsx
 * const { isDragging, dragY, isClosing } = useBottomSheetDrag({
 *   dragHandleRef,
 *   sheetState,
 *   setSheetState,
 *   onClose,
 *   hasScroll,
 *   listingCount
 * })
 * ```
 */
export default function useBottomSheetDrag({
  dragHandleRef,
  sheetState,
  setSheetState,
  onClose,
  hasScroll,
  listingCount,
}: UseBottomSheetDragParams): UseBottomSheetDragReturn {
  const [isDragging, setIsDragging] = useState(false)
  const [dragY, setDragY] = useState(0)
  const [isClosing, setIsClosing] = useState(false)
  const startYRef = useRef(0)

  // 드래그 시작
  const handleDragStart = (clientY: number) => {
    setIsDragging(true)
    startYRef.current = clientY
  }

  // 드래그 중
  const handleDragMove = (clientY: number) => {
    if (!isDragging) return

    const deltaY = clientY - startYRef.current

    // 위로 드래그 (확장)는 스크롤이 있고 매물이 3개 이상일 때만 가능
    if (deltaY < 0 && hasScroll && listingCount > 2 && sheetState === 'collapsed') {
      setDragY(deltaY)
    } else if (deltaY > 0) {
      // 아래로 드래그 (축소/닫기) - 제한 없이 부드럽게
      setDragY(deltaY)
    }
  }

  // 드래그 종료
  const handleDragEnd = () => {
    setIsDragging(false)

    const deltaY = dragY
    const threshold = 100 // 임계값

    // expanded 상태에서 아래로 드래그
    if (sheetState === 'expanded') {
      if (deltaY > 200) {
        // 많이 내렸으면 (200px 이상) -> 바로 닫기
        setDragY(0)
        setIsClosing(true)
        setTimeout(() => {
          onClose()
          setIsClosing(false)
          setSheetState('collapsed')
        }, 200)
      } else if (deltaY > threshold) {
        // 적당히 내렸으면 (100px 이상) -> collapsed로
        setDragY(0) // 즉시 리셋
        setSheetState('collapsed')
      } else {
        // 임계값 미만이면 원래 위치로
        setDragY(0)
      }
    }
    // collapsed 상태
    else {
      if (deltaY > 80) {
        // collapsed에서 아래로 드래그 -> 닫기
        setDragY(0)
        setIsClosing(true)
        setTimeout(() => {
          onClose()
          setIsClosing(false)
          setSheetState('collapsed')
        }, 200)
      } else if (deltaY < -100 && hasScroll && listingCount > 2) {
        // collapsed에서 위로 드래그 -> expanded (매물 3개 이상일 때만)
        setDragY(0) // 즉시 리셋
        setSheetState('expanded')
      } else {
        // 임계값 미만이면 원래 위치로
        setDragY(0)
      }
    }
  }

  // 전역 드래그 이벤트 핸들러
  const handleMouseMove = (e: MouseEvent) => {
    handleDragMove(e.clientY)
  }

  const handleMouseUp = () => {
    handleDragEnd()
  }

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault()
    handleDragMove(e.touches[0].clientY)
  }

  const handleTouchEnd = () => {
    handleDragEnd()
  }

  // 드래그 핸들에 네이티브 이벤트 리스너 등록 (passive: false로 설정)
  useEffect(() => {
    const dragHandle = dragHandleRef.current
    if (!dragHandle) return

    const handleNativeTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      e.stopPropagation()
      handleDragStart(e.touches[0].clientY)
    }

    const handleNativeMouseDown = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      handleDragStart(e.clientY)
    }

    // passive: false로 명시하여 preventDefault() 사용 가능하게 함
    dragHandle.addEventListener('touchstart', handleNativeTouchStart, { passive: false })
    dragHandle.addEventListener('mousedown', handleNativeMouseDown)

    return () => {
      dragHandle.removeEventListener('touchstart', handleNativeTouchStart)
      dragHandle.removeEventListener('mousedown', handleNativeMouseDown)
    }
  }, [dragHandleRef])

  // 전역 드래그 이벤트 리스너 등록
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchmove', handleTouchMove, { passive: false })
      window.addEventListener('touchend', handleTouchEnd)

      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
        window.removeEventListener('touchmove', handleTouchMove)
        window.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging, dragY])

  return {
    isDragging,
    dragY,
    isClosing,
  }
}
