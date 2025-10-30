'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import useBottomSheetDrag from '@/hook/modal/useBottomSheetDrag'
import useBottomSheetHeight, { type SheetState } from '@/hook/modal/useBottomSheetHeight'
import useContentScroll from '@/hook/modal/useContentScroll'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  listingCount?: number // 매물 개수에 따라 초기 높이 조절 (옵션)
  fixedHeight?: number // 고정 높이 (px) - listingCount 대신 사용 가능
  expandable?: boolean // 확장 가능 여부 (기본: listingCount가 있으면 true)
}

/**
 * 공통 바텀 시트 컴포넌트
 *
 * 하단에 고정된 채로 높이가 변하는 모달 시트입니다.
 * 드래그로 닫기, 외부 클릭으로 닫기, 확장/축소 등의 기능을 제공합니다.
 *
 * 사용 방법:
 * 1. listingCount를 제공하면 동적 높이 + 확장 가능
 * 2. fixedHeight를 제공하면 고정 높이 + 확장 불가
 *
 * @param isOpen - 열림 상태
 * @param onClose - 닫기 콜백
 * @param children - 바텀 시트 내용
 * @param listingCount - 매물 개수 (동적 높이용)
 * @param fixedHeight - 고정 높이 (px)
 * @param expandable - 확장 가능 여부
 */
export default function BottomSheet({
  isOpen,
  onClose,
  children,
  listingCount,
  fixedHeight,
  expandable,
}: BottomSheetProps) {
  const [sheetState, setSheetState] = useState<SheetState>('collapsed')
  const sheetRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const dragHandleRef = useRef<HTMLDivElement>(null)

  // expandable 기본값: listingCount가 있으면 true, fixedHeight가 있으면 false
  const isExpandable = expandable ?? (listingCount !== undefined && !fixedHeight)

  // 스크롤 감지
  const hasScroll = useContentScroll(contentRef, children, isOpen, [sheetState])

  // 드래그 처리
  const { isDragging, dragY, isClosing } = useBottomSheetDrag({
    dragHandleRef,
    sheetState,
    setSheetState,
    onClose,
    hasScroll,
    listingCount: listingCount ?? 1,
  })

  // 높이 계산
  const heightParams = {
    listingCount: listingCount ?? 1,
    sheetState,
    isDragging,
    dragY,
    ...(fixedHeight !== undefined && { fixedHeight }),
  }
  const getSheetHeight = useBottomSheetHeight(heightParams)

  // 오버레이 클릭 (외부 터치 시 닫기)
  const handleOverlayClick = useCallback(() => {
    if (isOpen && !isDragging) {
      onClose()
    }
  }, [isOpen, isDragging, onClose])

  // 열림 상태가 변경될 때 초기화
  useEffect(() => {
    if (isOpen) {
      return () => {
        setSheetState('collapsed')
      }
    }
  }, [isOpen])

  return (
    <>
      {/* 오버레이 (외부 터치 감지) - 백드롭 없음 */}
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
        onClick={e => e.stopPropagation()}
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
