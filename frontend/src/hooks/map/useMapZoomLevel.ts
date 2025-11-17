import { useEffect, useState } from 'react'



/**
 * 지도의 줌 레벨을 추적하는 훅
 *
 * 지도 줌 변경 이벤트를 감지하여 현재 레벨을 반환합니다.
 *
 * @param map - 카카오 지도 인스턴스
 * @returns 현재 줌 레벨 (1-14)
 *
 * @example
 * const zoomLevel = useMapZoomLevel(map)
 * if (zoomLevel >= 7) {
 *   // 클러스터 모드
 * }
 */
export default function useMapZoomLevel(map: KakaoMap | null): number {
  const [zoomLevel, setZoomLevel] = useState<number>(3)

  useEffect(() => {
    if (!map || !window.kakao) return

    const handleZoomChanged = () => {
      const level = map.getLevel()
      setZoomLevel(level)
    }

    // 초기 레벨 설정
    handleZoomChanged()

    // 줌 변경 이벤트 리스너 등록
    window.kakao.maps.event.addListener(map, 'zoom_changed', handleZoomChanged)

    return () => {
      window.kakao.maps.event.removeListener(map, 'zoom_changed', handleZoomChanged)
    }
  }, [map])

  return zoomLevel
}
