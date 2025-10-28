/**
 * 사용자 위치 마커 UI를 생성하는 함수
 *
 * 파란색 파동 효과와 중앙 원으로 구성된 마커를 생성합니다.
 * 주로 GPS로 가져온 사용자의 현재 위치를 표시하는 데 사용됩니다.
 *
 * @param onClick - 클릭 콜백
 */
export function createUserLocationMarkerElement(onClick?: () => void): HTMLDivElement {
  const container = document.createElement('div')
  container.className = 'relative flex items-center justify-center w-16 h-16'

  // 파동 효과 (4개의 원이 순차적으로 퍼져나감)
  for (let i = 0; i < 4; i++) {
    const ripple = document.createElement('div')
    ripple.className = 'absolute w-16 h-16 rounded-full bg-blue-500/20 animate-ping'
    ripple.style.animationDelay = `${i * 0.4}s`
    ripple.style.animationDuration = '2s'
    container.appendChild(ripple)
  }

  // 중앙 원 (실제 위치 지점)
  const centerCircle = document.createElement('div')
  centerCircle.className =
    'relative z-10 w-4 h-4 rounded-full bg-white shadow-lg border-4 border-blue-600 cursor-pointer'

  if (onClick) {
    centerCircle.addEventListener('click', onClick)
  }

  container.appendChild(centerCircle)

  return container
}

