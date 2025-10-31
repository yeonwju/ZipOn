'use client'

import React from 'react'

import BottomSheet from './BottomSheet'

interface ListingBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  listingCount?: number // 매물 개수에 따라 초기 높이 조절
}

/**
 * 매물 목록 바텀 시트 컴포넌트
 *
 * 공통 BottomSheet를 사용하여 매물 목록을 표시합니다.
 * 매물 개수에 따라 동적으로 높이가 조절됩니다.
 *
 * @param isOpen - 열림 상태
 * @param onClose - 닫기 콜백
 * @param children - 바텀 시트 내용 (매물 목록)
 * @param listingCount - 매물 개수 (1개=230px, 2개=55vh, 3개+=55vh)
 */
export default function ListingBottomSheet({
  isOpen,
  onClose,
  children,
  listingCount = 3,
}: ListingBottomSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} listingCount={listingCount}>
      {children}
    </BottomSheet>
  )
}
