import { useEffect } from 'react'



/**
 * 지도 인터랙션 이벤트를 감지하는 훅
 *
 * 지도의 드래그 시작, 중심 좌표 변경 등의 이벤트를 감지하여 콜백을 실행합니다.
 * 주로 바텀 시트나 모달을 자동으로 닫는 용도로 사용됩니다.
 *
 * @param map - 카카오 지도 인스턴스
 * @param onInteraction - 지도 인터랙션 발생 시 실행할 콜백
 * @param events - 감지할 이벤트 목록 (기본: ['dragstart', 'zoom_changed'])
 *
 * @example
 * ```typescript
 * useMapInteraction(map, () => {
 *   setIsBottomSheetOpen(false)
 * })
 * ```
 */
export default function useMapInteraction(
  map: any,
  onInteraction?: () => void,
  events: string[] = ['dragstart', 'zoom_changed']
) {
  useEffect(() => {
    if (!map || !window.kakao || !onInteraction) return

    const handleInteraction = () => {
      onInteraction()
    }

    // 각 이벤트에 대해 리스너 등록
    events.forEach(eventType => {
      window.kakao.maps.event.addListener(map, eventType, handleInteraction)
    })

    // cleanup: 이벤트 리스너 제거
    return () => {
      events.forEach(eventType => {
        window.kakao.maps.event.removeListener(map, eventType, handleInteraction)
      })
    }
  }, [map, onInteraction, events])
}

