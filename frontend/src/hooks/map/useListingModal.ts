import { useCallback, useState } from 'react'

import type { ListingData } from '@/types/listing'

/**
 * 매물 모달(바텀시트) 관리 훅
 *
 * 모달의 열림/닫힘 상태와 선택된 매물을 관리합니다.
 *
 * @returns 모달 상태와 제어 함수들
 *
 * @example
 * ```tsx
 * const { isOpen, selectedListings, openModal, closeModal } = useListingModal()
 * ```
 */
export function useListingModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedListings, setSelectedListings] = useState<ListingData[]>([])

  /**
   * 모달 열기
   * 매물이 없으면 모달을 열지 않음
   */
  const openModal = useCallback((listings?: ListingData[]) => {
    if (!listings || listings.length === 0) {
      return
    }
    setIsOpen(true)
    setSelectedListings(listings)
  }, [])

  /**
   * 모달 닫기
   */
  const closeModal = useCallback(() => {
    setIsOpen(false)
    setSelectedListings([])
  }, [])

  return {
    isOpen,
    selectedListings,
    openModal,
    closeModal,
  }
}
