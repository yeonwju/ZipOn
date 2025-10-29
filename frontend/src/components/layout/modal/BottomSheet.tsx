'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import useBottomSheetDrag from '@/hook/modal/useBottomSheetDrag'
import useBottomSheetHeight, { type SheetState } from '@/hook/modal/useBottomSheetHeight'
import useContentScroll from '@/hook/modal/useContentScroll'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  listingCount?: number // 매물 개수에 따라 초기 높이 조절
}

/**
 * 바텀 시트 컴포넌트
 *
 * 하단에 고정된 채로 높이가 변하는 모달 시트입니다.
 * 드래그로 닫기, 외부 클릭으로 닫기, 확장/축소 등의 기능을 제공합니다.
 *
 * 상태:
 * - collapsed: 기본 상태 (매물 개수에 따라 동적 높이: 1개=230px, 2개=55vh, 3개+=55vh)
 * - expanded: 확장 상태 (100vh - 80px 높이, 서치바 아래 여백)
 *
 * 드래그 동작:
 * - collapsed에서 위로 100px+ 드래그 → expanded (매물 3개 이상, 스크롤 필요할 때만)
 * - collapsed에서 아래로 80px+ 드래그 → 닫기 (높이 0)
 * - expanded에서 아래로 200px+ 드래그 → 바로 닫기
 * - expanded에서 아래로 100px+ 드래그 → collapsed (높이 줄어듦)
 * - 드래그 중에는 실시간으로 높이가 변경됨
 *
 * 닫기 방법:
 * - 외부(지도) 터치
 * - 지도 이동/줌
 *
 * 확장 조건:
 * - 매물이 3개 이상이고 컨텐츠에 스크롤이 필요한 경우에만 확장 가능
 *
 * 특징:
 * - bottom: 0에 고정, 위로 들리지 않음
 * - height만 변경되어 아래에서 자연스럽게 늘어남
 *
 * @param isOpen - 열림 상태
 * @param onClose - 닫기 콜백
 * @param children - 바텀 시트 내용
 * @param listingCount - 매물 개수 (1개=230px, 2개=55vh, 3개+=55vh)
 */
export default function BottomSheet({
  isOpen,
  onClose,
  children,
  listingCount = 3,
}: BottomSheetProps) {
  const [sheetState, setSheetState] = useState<SheetState>('collapsed')
  const sheetRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const dragHandleRef = useRef<HTMLDivElement>(null)

  // 스크롤 감지
  const hasScroll = useContentScroll(contentRef, children, isOpen, [sheetState])

  // 드래그 처리
  const { isDragging, dragY, isClosing } = useBottomSheetDrag({
    dragHandleRef,
    sheetState,
    setSheetState,
    onClose,
    hasScroll,
    listingCount,
  })

  // 높이 계산
  const getSheetHeight = useBottomSheetHeight({
    listingCount,
    sheetState,
    isDragging,
    dragY,
  })

  // 오버레이 클릭 (외부 터치 시 닫기)
  const handleOverlayClick = useCallback(() => {
    if (isOpen && !isDragging) {
      onClose()
    }
  }, [isOpen, isDragging, onClose])

  // 열림 상태가 변경될 때 초기화 (cleanup으로 처리)
  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때는 아무것도 하지 않음
      return () => {
        // 모달이 닫힐 때 cleanup에서 상태 초기화
        setSheetState('collapsed')
      }
    }
  }, [isOpen])

  return (
    <>
      {/* 오버레이 (외부 터치 감지) */}
      {isOpen && (
        <div
          className="pointer-events-auto absolute inset-0 z-10"
          onClick={handleOverlayClick}
          onTouchStart={handleOverlayClick}
        />
      )}

      {/* 바텀 시트 */}
      <div
        ref={sheetRef}
        className="pointer-events-auto fixed bottom-0 left-0 z-20 flex w-full flex-col rounded-t-2xl bg-white"
        style={{
          height: isOpen && !isClosing ? getSheetHeight() : '0px',
          transition: isDragging ? 'none' : 'height 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()} // 이벤트 버블링 방지
      >
        {/* 드래그 핸들 */}
        <div
          ref={dragHandleRef}
          className="flex cursor-grab items-center justify-between rounded-t-2xl bg-white px-4 py-3 active:cursor-grabbing"
          style={{
            boxShadow: '0 -1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}
        >
          <div className="flex w-full flex-col items-center justify-center gap-2">
            <div className="h-1 w-12 rounded-full bg-gray-300" />
          </div>
        </div>

        {/* 컨텐츠 */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto"
          style={{
            touchAction: 'pan-y',
            paddingBottom: 'max(58px, env(safe-area-inset-bottom))',
          }}
          onTouchStart={e => e.stopPropagation()}
          onTouchMove={e => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </>
  )
}
