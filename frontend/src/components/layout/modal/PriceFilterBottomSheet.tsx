'use client'

import React from 'react'

import type { PriceFilter } from '@/types/filter'

import BottomSheet from './BottomSheet'
import PriceFilterComponent from './filters/PriceFilter'

interface PriceFilterBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  selectedPrice: PriceFilter
  onSelectPrice: (price: PriceFilter) => void
}

export default function PriceFilterBottomSheet({
  isOpen,
  onClose,
  selectedPrice,
  onSelectPrice,
}: PriceFilterBottomSheetProps) {
  const handleApply = () => {
    // PriceFilter 컴포넌트 내부에서 이미 onSelectPrice를 호출하므로
    // 여기서는 추가 작업이 필요 없을 수 있지만, 필요시 처리
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} fixedHeight={450} expandable={false}>
      {isOpen && (
        <PriceFilterComponent
          key={`price-filter-${isOpen}`}
          selectedPrice={selectedPrice}
          onPriceChange={onSelectPrice}
          onApply={handleApply}
          onClose={onClose}
        />
      )}
    </BottomSheet>
  )
}
