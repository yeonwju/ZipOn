'use client'

import { PriceFilter as PriceFilterComponent } from '@/components/features/listings'
import { useMapFilterStore } from '@/store/mapFilter'

import BottomSheet from './BottomSheet'

interface PriceFilterBottomSheetProps {
  isOpen: boolean
  onClose: () => void
}

export default function PriceFilterBottomSheet({
  isOpen,
  onClose,
}: PriceFilterBottomSheetProps) {
  // Store에서 필터 상태 및 액션 가져오기
  const priceFilter = useMapFilterStore(state => state.priceFilter)
  const setPriceFilter = useMapFilterStore(state => state.setPriceFilter)

  const handleApply = () => {
    // PriceFilter 컴포넌트 내부에서 이미 setPriceFilter를 호출하므로
    // 여기서는 추가 작업이 필요 없을 수 있지만, 필요시 처리
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} fixedHeight={450} expandable={false}>
      {isOpen && (
        <PriceFilterComponent
          key={`price-filter-${isOpen}`}
          selectedPrice={priceFilter}
          onPriceChange={setPriceFilter}
          onApply={handleApply}
          onClose={onClose}
        />
      )}
    </BottomSheet>
  )
}
