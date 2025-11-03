/**
 * 선택된 주소 위치 마커 UI를 생성하는 함수
 *
 * 빨간색 파동 효과와 중앙 원으로 구성된 마커를 생성합니다.
 * 사용자가 선택한 주소의 위치를 표시하는 데 사용됩니다.
 *
 * z-index 구조:
 * - 컨테이너: 1 (기본)
 * - 중앙 원, 파동: 9999 (가장 위, 모든 요소보다)
 *
 * pointer-events 구조:
 * - 컨테이너: none (클릭 관통, 아래 클러스터 클릭 가능)
 * - 파동 효과: none (클릭 관통)
 * - 중앙 원: auto (클릭 가능)
 *
 * @param onClick - 클릭 콜백
 */
export function createAddressLocationMarkerElement(onClick?: () => void): HTMLDivElement {
  const container = document.createElement('div')
  container.className = 'relative flex items-center justify-center w-16 h-16 pointer-events-none'
  container.style.zIndex = '1' // 컨테이너는 낮은 z-index

  // 파동 효과 (4개의 원이 순차적으로 퍼져나감) - 빨간색
  for (let i = 0; i < 4; i++) {
    const ripple = document.createElement('div')
    ripple.className =
      'absolute w-16 h-16 rounded-full bg-red-500/20 animate-ping pointer-events-none'
    ripple.style.animationDelay = `${i * 0.4}s`
    ripple.style.animationDuration = '2s'
    ripple.style.zIndex = '9999'
    container.appendChild(ripple)
  }

  // 중앙 원 (실제 위치 지점) - 빨간색
  const centerCircle = document.createElement('div')
  centerCircle.className =
    'relative w-4 h-4 rounded-full bg-white shadow-lg border-4 border-red-600 cursor-pointer pointer-events-none'
  centerCircle.style.zIndex = '9999'

  if (onClick) {
    centerCircle.addEventListener('click', onClick)
  }

  container.appendChild(centerCircle)

  return container
}

