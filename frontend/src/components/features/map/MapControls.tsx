import { LocateFixed } from 'lucide-react'

interface MapControlsProps {
  /**
   * 현재 위치로 이동 버튼 클릭 핸들러
   */
  onMoveToCurrentLocation: () => void

  /**
   * 버튼 활성화 여부 (위치 정보가 있을 때만 활성화)
   */
  disabled?: boolean
}

/**
 * 지도 제어 버튼 컴포넌트
 *
 * 현재 위치로 이동하는 버튼을 제공합니다.
 * 우측 하단에 고정된 위치에 표시됩니다.
 * 반응형으로 바텀시트와 겹치지 않도록 위치 조정.
 */
export default function MapControls({ onMoveToCurrentLocation, disabled }: MapControlsProps) {
  return (
    <button
      onClick={onMoveToCurrentLocation}
      disabled={disabled}
      className="pointer-events-auto absolute right-3 bottom-18 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:scale-110 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100 sm:right-4 sm:bottom-20 md:right-6 md:bottom-16"
      aria-label="현재 위치로 이동"
    >
      <LocateFixed className="h-5 w-5 text-blue-500" />
    </button>
  )
}
