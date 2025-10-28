import type { kakao } from '@/types/kakao.maps'

/**
 * 커스텀 마커를 생성하는 유틸리티 함수
 * 
 * 이 함수는 파란색 파동 효과가 있는 커스텀 마커를 생성합니다.
 * 주로 사용자의 현재 위치를 표시하는 데 사용됩니다.
 * 
 * **마커 구성:**
 * - 4개의 파동 원: 바깥쪽으로 퍼지는 애니메이션 효과
 * - 중앙 원: 실제 위치를 나타내는 파란색 점
 * - 흰색 테두리: 가시성 향상
 * - 그림자 효과: 입체감 부여
 * 
 * **애니메이션:**
 * - 각 파동은 0.4초 간격으로 시작
 * - 2초 동안 확대되며 사라짐
 * - 무한 반복 (animate-ping)
 * 
 * **상호작용:**
 * - 중앙 원 클릭 가능 (cursor-pointer)
 * - onClick 콜백으로 클릭 이벤트 처리
 * 
 * @param map - 카카오 지도 인스턴스
 * @param position - 마커를 표시할 위치 좌표 { lat: number, lng: number }
 * @param onClick - 마커 클릭 시 실행될 콜백 함수 (선택사항)
 * 
 * @returns 생성된 CustomOverlay 인스턴스
 * 
 * @throws {Error} window.kakao나 map이 없으면 에러 발생
 * 
 * @example
 * ```tsx
 * // 기본 사용법
 * const marker = createCustomMarker(
 *   map,
 *   { lat: 37.5665, lng: 126.978 }
 * )
 * 
 * // 마커를 지도에서 제거
 * marker.setMap(null)
 * ```
 * 
 * @example
 * ```tsx
 * // 클릭 이벤트와 함께
 * const marker = createCustomMarker(
 *   map,
 *   userLocation,
 *   () => {
 *     console.log('위치 마커 클릭됨!')
 *     // 정보창 표시 등의 작업
 *   }
 * )
 * ```
 * 
 * @example
 * ```tsx
 * // 여러 마커 생성
 * const markers = locations.map(location => 
 *   createCustomMarker(map, location, () => {
 *     alert(`위치: ${location.lat}, ${location.lng}`)
 *   })
 * )
 * 
 * // 모든 마커 제거
 * markers.forEach(marker => marker.setMap(null))
 * ```
 */
export function createCustomMarker(
  map: kakao.maps.Map,
  position: { lat: number; lng: number },
  onClick?: () => void
): kakao.maps.CustomOverlay {
  if (!window.kakao || !map) {
    throw new Error('Kakao map is not initialized')
  }

  // 컨테이너 생성
  const container = document.createElement('div')
  container.className = 'relative flex items-center justify-center w-16 h-16'
  
  // 파동 효과를 위한 여러 개의 원 생성 (더 자연스러운 ripple 효과)
  for (let i = 0; i < 4; i++) {
    const ripple = document.createElement('div')
    ripple.className = `absolute w-16 h-16 rounded-full bg-blue-500/20 animate-ping`
    ripple.style.animationDelay = `${i * 0.4}s`
    ripple.style.animationDuration = '2s'
    container.appendChild(ripple)
  }
  
  // 중앙 파란색 원 (더 작게)
  const centerCircle = document.createElement('div')
  centerCircle.className = 'relative z-10 w-4 h-4 rounded-full bg-blue-600 shadow-lg border border-white cursor-pointer'
  
  if (onClick) {
    centerCircle.addEventListener('click', onClick)
  }
  
  container.appendChild(centerCircle)

  // 커스텀 오버레이 생성
  const overlay = new window.kakao.maps.CustomOverlay({
    position: new window.kakao.maps.LatLng(position.lat, position.lng),
    content: container,
    xAnchor: 0.5,
    yAnchor: 0.5,
    clickable: true,
  })

  overlay.setMap(map)
  
  return overlay
}

