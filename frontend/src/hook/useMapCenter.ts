import { useEffect, useRef, useState } from 'react'

import type { kakao } from '@/types/kakao.maps'

/**
 * 지도 좌표 타입 정의
 * @property lat - 위도 (latitude)
 * @property lng - 경도 (longitude)
 */
interface Position {
  lat: number
  lng: number
}

/**
 * 지도 중심 좌표 변경을 감지하고 디바운스 처리하는 훅
 * 
 * ⚠️ **현재 상태: 미사용**
 * 현재 프로젝트에서는 사용되지 않지만, 향후 지도 이동 시
 * 매물을 다시 불러오는 기능 구현 시 사용할 수 있습니다.
 * 
 * 이 훅은 사용자가 지도를 드래그하거나 이동할 때 지도의 중심 좌표를 추적합니다.
 * 디바운스를 적용하여 과도한 업데이트를 방지하고 성능을 최적화합니다.
 * 
 * **사용 시나리오:**
 * - 지도 중심이 변경될 때마다 해당 영역의 매물 다시 불러오기
 * - 사용자가 지도를 이동한 후 새로운 검색 결과 표시
 * - 현재 보이는 지역의 정보 업데이트
 * 
 * **디바운스 동작:**
 * - 지도 이동 중에는 상태가 업데이트되지 않음
 * - 지도 이동이 멈춘 후 설정한 시간(debounceMs) 후에 상태 업데이트
 * - 불필요한 API 호출이나 렌더링 방지
 * 
 * @param map - 카카오 지도 인스턴스 (react-kakao-maps-sdk의 onCreate로 받은 Map 객체)
 * @param defaultPosition - 초기 중심 좌표 (지도가 로드되기 전 사용)
 * @param debounceMs - 디바운스 시간 (밀리초), 기본값 500ms
 *                     값이 작을수록 빠르게 반응하지만 성능 부담 증가
 * 
 * @returns 현재 지도의 중심 좌표 (Position 타입)
 * 
 * @example
 * ```tsx
 * // 기본 사용법 - 지도 중심 추적
 * const [map, setMap] = useState(null)
 * const center = useMapCenter(map, { lat: 37.5665, lng: 126.978 })
 * 
 * console.log('현재 지도 중심:', center)
 * // 지도를 움직이면 500ms 후에 center 값이 업데이트됨
 * 
 * return <Map onCreate={setMap} ... />
 * ```
 * 
 * @example
 * ```tsx
 * // 중심 변경 시 API 호출하기
 * const center = useMapCenter(map, defaultCenter, 1000) // 1초 디바운스
 * 
 * useEffect(() => {
 *   // center가 변경되면 해당 영역의 매물을 불러옴
 *   fetchListingsInArea(center.lat, center.lng)
 * }, [center])
 * ```
 * 
 * @example
 * ```tsx
 * // 빠른 반응이 필요한 경우 (디바운스 시간 단축)
 * const center = useMapCenter(map, defaultCenter, 100)
 * 
 * // 중심 좌표를 화면에 표시
 * return (
 *   <div>
 *     <Map onCreate={setMap} ... />
 *     <div className="coordinates">
 *       위도: {center.lat.toFixed(6)}, 경도: {center.lng.toFixed(6)}
 *     </div>
 *   </div>
 * )
 * ```
 */
export default function useMapCenter(
  map: kakao.maps.Map | null,
  defaultPosition: Position,
  debounceMs: number = 500
): Position {
  const [center, setCenter] = useState<Position>(defaultPosition)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!map) return

    /**
     * 지도 중심 변경 핸들러
     * 지도가 드래그되거나 이동할 때마다 호출됨
     */
    const handleCenterChanged = () => {
      // 이전 타이머가 있으면 취소
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // 지정된 시간 후에 새로운 중심 좌표 업데이트
      timeoutRef.current = setTimeout(() => {
        const latlng = map.getCenter()
        setCenter({ lat: latlng.getLat(), lng: latlng.getLng() })
        console.log(' 현재 지도 중심:', {
          lat: latlng.getLat(),
          lng: latlng.getLng(),
        })
      }, debounceMs)
    }

    // React-Kakao-Maps SDK의 이벤트 리스너는 자동으로 관리되므로
    // 여기서는 타이머만 정리합니다
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [map, debounceMs])

  return center
}

