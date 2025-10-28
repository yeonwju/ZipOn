import { useEffect, useRef } from 'react'

import { createCustomMarker } from '@/lib/createCustomMarker'
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
 * 지도에 단일 커스텀 마커를 관리하는 훅
 *
 * 이 훅은 주로 사용자의 현재 위치를 표시하는 데 사용됩니다.
 * 파란색 파동 효과와 중앙 원으로 구성된 커스텀 마커를 생성합니다.
 *
 * **마커 특징:**
 * - 파란색 파동 애니메이션 (위치를 시각적으로 강조)
 * - 중앙의 파란색 원 (실제 위치 지점)
 * - 자동 중복 제거 (이전 마커 삭제)
 * - 위치 변경 시 마커 자동 업데이트
 *
 * **주의사항:**
 * - 이 훅은 하나의 마커만 관리합니다
 * - 여러 마커가 필요하면 useListingMarkers 사용
 * - position이 null이면 마커가 표시되지 않음
 *
 * @param map - 카카오 지도 인스턴스 (react-kakao-maps-sdk의 onCreate로 받은 Map 객체)
 * @param position - 마커를 표시할 위치 좌표 (GPS 좌표, null이면 마커 미표시)
 * @param onClick - 마커 클릭 시 실행될 콜백 함수 (선택사항)
 *
 * @example
 * ```tsx
 * // 기본 사용법 - 사용자 현재 위치 표시
 * const [map, setMap] = useState(null)
 * const { location } = useUserLocation() // GPS로 현재 위치 가져오기
 *
 * useUserMarker(map, location, () => {
 *   console.log('내 위치 마커 클릭!')
 * })
 *
 * return <Map onCreate={setMap} center={location || defaultCenter} />
 * ```
 *
 * @example
 * ```tsx
 * // 클릭 시 정보 표시
 * useUserMarker(map, userLocation, () => {
 *   alert(`현재 위치: ${userLocation.lat}, ${userLocation.lng}`)
 * })
 * ```
 *
 * @example
 * ```tsx
 * // 특정 좌표에 마커 표시
 * const headquarterLocation = { lat: 37.5665, lng: 126.978 }
 *
 * useUserMarker(map, headquarterLocation, () => {
 *   router.push('/headquarters')
 * })
 * ```
 *
 * @example
 * ```tsx
 * // 조건부 마커 표시
 * const [showMyLocation, setShowMyLocation] = useState(true)
 * const { location } = useUserLocation()
 *
 * useUserMarker(
 *   map,
 *   showMyLocation ? location : null, // null이면 마커 미표시
 *   () => setShowMyLocation(false)
 * )
 * ```
 */
export default function useUserMarker(
  map: kakao.maps.Map | null,
  position: Position | null,
  onClick?: () => void
) {
  const overlayRef = useRef<kakao.maps.CustomOverlay | null>(null)

  useEffect(() => {
    // 지도 인스턴스 또는 위치가 없으면 마커 생성 불가
    if (!map || !window.kakao || !position) return

    // 이전 마커 제거 (중복 방지)
    if (overlayRef.current) {
      overlayRef.current.setMap(null)
    }

    // 새로운 마커를 GPS 위치에 생성
    overlayRef.current = createCustomMarker(map, position, onClick)

    // cleanup: 컴포넌트 언마운트 시 마커 제거
    return () => {
      if (overlayRef.current) {
        overlayRef.current.setMap(null)
      }
    }
  }, [map, position, onClick])
}
