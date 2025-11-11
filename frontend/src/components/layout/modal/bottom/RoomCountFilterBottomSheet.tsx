'use client'

import { RoomCountFilter as RoomCountFilterComponent } from '@/components/features/listings'
import { useMapFilterStore } from '@/store/mapFilter'
import type { RoomCountFilter } from '@/types/filter'

import BottomSheet from './BottomSheet'

interface RoomCountFilterBottomSheetProps {
  isOpen: boolean
  onClose: () => void
}

export default function RoomCountFilterBottomSheet({
  isOpen,
  onClose,
}: RoomCountFilterBottomSheetProps) {
  // Store에서 필터 상태 및 액션 가져오기
  const roomCountFilter = useMapFilterStore(state => state.roomCountFilter)
  const setRoomCountFilter = useMapFilterStore(state => state.setRoomCountFilter)

  const handleSelect = (roomCount: RoomCountFilter) => {
    // 'all'은 필터 없음을 의미하므로 undefined로 전달
    setRoomCountFilter(roomCount === 'all' ? undefined : roomCount)
    onClose()
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} fixedHeight={180} expandable={false}>
      <RoomCountFilterComponent
        selectedRoomCount={roomCountFilter ?? 'all'}
        onRoomCountChange={handleSelect}
      />
    </BottomSheet>
  )
}
