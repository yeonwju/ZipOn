'use client'

import RoomCountFilterComponent from '@/components/features/listings/filters/RoomCountFilter'
import type { RoomCountFilter } from '@/types/filter'

import BottomSheet from './BottomSheet'

interface RoomCountFilterBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  selectedRoomCount: RoomCountFilter
  onSelectRoomCount: (roomCount: RoomCountFilter | undefined) => void
}

export default function RoomCountFilterBottomSheet({
  isOpen,
  onClose,
  selectedRoomCount,
  onSelectRoomCount,
}: RoomCountFilterBottomSheetProps) {
  const handleSelect = (roomCount: RoomCountFilter) => {
    // 'all'은 필터 없음을 의미하므로 undefined로 전달
    onSelectRoomCount(roomCount === 'all' ? undefined : roomCount)
    onClose()
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} fixedHeight={180} expandable={false}>
      <RoomCountFilterComponent
        selectedRoomCount={selectedRoomCount}
        onRoomCountChange={handleSelect}
      />
    </BottomSheet>
  )
}
