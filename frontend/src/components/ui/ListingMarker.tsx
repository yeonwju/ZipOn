import type { ListingData } from '@/hook/useListingMarkers'

/**
 * 매물 마커의 UI 요소를 생성하는 함수
 *
 * **말풍선 구조:**
 * ```
 * container
 * └─ priceLabel (말풍선 본체)
 *     ├─ depositBox (상단: 파란색 배경, 흰색 글씨)
 *     └─ rentBox (하단: 흰색 배경, 파란색 글씨, 파란색 테두리)
 *     └─ after (중앙 하단 꼬리 - 이 끝이 정확한 좌표를 가리킴)
 * ```
 *
 * **좌표 정렬:**
 * - 말풍선 꼬리 끝이 정확히 지도 좌표를 가리킴
 * - CustomOverlay의 yAnchor와 함께 작동하여 정확한 위치 표시
 */
export function createListingMarkerElement(
  listing: ListingData,
  onClick?: (listing: ListingData) => void
): HTMLDivElement {
  const container = document.createElement('div')
  // pb-[6px]: 꼬리 길이만큼 하단 패딩 추가하여 꼬리 끝이 정확히 좌표를 가리키도록 함
  container.className = `relative cursor-pointer transform transition-transform hover:scale-110 pb-[6px]`

  // 💰 말풍선 본체 컨테이너
  const priceLabel = document.createElement('div')
  priceLabel.className = `
    relative rounded-md shadow-md flex flex-col text-center text-xs font-bold
    after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-[-6px]
    after:border-l-[6px] after:border-r-[6px] after:border-t-[6px]
    after:border-l-transparent after:border-r-transparent after:border-t-blue-500
  `

  //  보증금 박스 (말풍선 상단)
  const depositBox = document.createElement('div')
  depositBox.className = `bg-blue-500 text-white px-3 py-1 rounded-t-md`

  depositBox.textContent =
    listing.deposit >= 10000 ? `${listing.deposit / 10000}억` : `${listing.deposit}만`

  //  월세 박스 (말풍선 하단, 있는 경우에만)
  const rentBox = document.createElement('div')
  rentBox.className = `bg-white text-blue-500 border border-blue-500 px-3 py-1 rounded-b-md`
  rentBox.textContent = listing.rent > 0 ? `${listing.rent}만` : ''

  // ️ DOM 구조 조립
  priceLabel.appendChild(depositBox)
  if (listing.rent > 0) priceLabel.appendChild(rentBox)
  container.appendChild(priceLabel)

  //  클릭 이벤트 등록
  if (onClick) {
    container.addEventListener('click', () => onClick(listing))
  }

  return container
}
