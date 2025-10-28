import { useEffect, useRef } from 'react'

import { createListingMarkerElement } from '@/components/ui/ListingMarker'

/**
 * 매물 데이터 타입 정의
 * @property name - 건물명
 * @property address - 건물 주소
 * @property lat - 위도 (latitude)
 * @property lng - 경도 (longitude)
 * @property deposit - 보증금 (단위: 만원)
 * @property rent - 월세 (단위: 만원)
 */
export type ListingData = {
  name: string
  address: string
  lat: number
  lng: number
  deposit: number
  rent: number
}

/**
 * 카카오 맵 CustomOverlay 타입 정의
 * window.kakao.maps.CustomOverlay의 인터페이스
 */
interface KakaoCustomOverlay {
  setMap: (map: unknown | null) => void
  getMap: () => unknown | null
  setPosition: (position: unknown) => void
  getPosition: () => unknown
  setContent: (content: HTMLElement | string) => void
  setVisible: (visible: boolean) => void
  getVisible: () => boolean
  setZIndex: (zIndex: number) => void
  getZIndex: () => number
}

/**
 * 지도에 매물 마커들을 관리하는 범용 훅
 *
 * 이 훅은 카카오 지도 위에 커스텀 매물 마커들을 표시합니다.
 * 마커 UI는 별도의 컴포넌트(ListingMarker.tsx)로 분리되어 있으며,
 * 이 훅은 마커의 생성, 배치, 제거 등의 로직만 담당합니다.
 *
 * **역할 분리:**
 * - 이 Hook: 마커의 생명주기 관리, 지도와의 상호작용, 좌표 정렬
 * - ListingMarker.tsx: 마커의 UI 생성 및 스타일링
 *
 * **주요 기능:**
 * - 여러 매물 위치에 커스텀 마커 생성
 * - 마커 클릭 시 콜백 함수 실행
 * - 컴포넌트 언마운트 시 자동으로 마커 정리
 * - 데이터 변경 시 마커 자동 업데이트
 *
 * **마커 디자인:**
 * (UI는 @/components/ui/ListingMarker.tsx에서 정의)
 * - 말풍선 형태의 가격 라벨
 * - 상단: 보증금 (파란색 배경, 흰색 글씨)
 * - 하단: 월세 (흰색 배경, 파란색 글씨)
 * - 중앙 하단 삼각형 꼬리 (정확한 좌표 지점 표시)
 * - 호버 시 스케일 애니메이션
 *
 * @param map - 카카오 지도 인스턴스 (react-kakao-maps-sdk의 onCreate로 받은 Map 객체)
 * @param listings - 표시할 매물 데이터 배열 (ListingData[] 타입)
 * @param onMarkerClick - 마커 클릭 시 실행될 콜백 함수 (선택사항)
 *                        클릭된 매물 정보를 인자로 받아 모달 표시 등의 작업 수행 가능
 *
 * @see createListingMarkerElement - 마커 UI 생성 함수 (@/components/ui/ListingMarker.tsx)
 *
 * @example
 * ```tsx
 * // 기본 사용법 - 클릭 이벤트 없이 마커만 표시
 * const [map, setMap] = useState(null)
 * const listings = [...] // 매물 데이터
 *
 * useListingMarkers(map, listings)
 *
 * return <Map onCreate={setMap} ... />
 * ```
 *
 * @example
 * ```tsx
 * // 클릭 이벤트와 함께 사용
 * const [selectedListing, setSelectedListing] = useState(null)
 *
 * useListingMarkers(map, listings, (listing) => {
 *   console.log('클릭된 매물:', listing.name)
 *   setSelectedListing(listing) // 모달 열기
 * })
 *
 * return (
 *   <>
 *     <Map onCreate={setMap} ... />
 *     {selectedListing && <Modal listing={selectedListing} />}
 *   </>
 * )
 * ```
 *
 * @example
 * ```tsx
 * // API에서 받은 데이터로 사용
 * const { data: listings } = useQuery('listings', fetchListings)
 *
 * useListingMarkers(map, listings ?? [], (listing) => {
 *   router.push(`/listing/${listing.id}`)
 * })
 * ```
 */
export default function useListingMarkers(
  map: unknown, // kakao.maps.Map (window.kakao를 사용하므로 타입 체크 불가)
  listings: ListingData[],
  onMarkerClick?: (listing: ListingData) => void
) {
  // 생성된 모든 오버레이를 추적하는 ref (cleanup을 위해 필요)
  const overlaysRef = useRef<KakaoCustomOverlay[]>([])

  useEffect(() => {
    // 지도 인스턴스가 없으면 마커 생성 불가
    if (!map || !window.kakao || !listings || listings.length === 0) return

    // 이전 마커들 제거
    overlaysRef.current.forEach(overlay => overlay.setMap(null))
    overlaysRef.current = []

    // 각 매물마다 커스텀 마커 생성
    listings.forEach(listing => {
      // UI 컴포넌트에서 마커 DOM 요소 생성
      // @see createListingMarkerElement - 마커 UI 생성 로직은 별도 파일로 분리됨
      const markerElement = createListingMarkerElement(listing, onMarkerClick)

      // 생성된 DOM 요소를 CustomOverlay로 지도에 추가
      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(listing.lat, listing.lng),
        content: markerElement,
        xAnchor: 0.5, // 수평 중앙 정렬: 말풍선이 좌표의 중앙에 위치
        yAnchor: 1, // 수직 하단 정렬: 말풍선 꼬리 끝이 정확히 좌표를 가리킴
        clickable: true, // 클릭 이벤트 활성화
      })

      // 지도에 오버레이 표시
      overlay.setMap(map)
      overlaysRef.current.push(overlay)
    })

    // cleanup: 모든 오버레이 제거
    return () => {
      overlaysRef.current.forEach(overlay => overlay.setMap(null))
      overlaysRef.current = []
    }
  }, [map, listings, onMarkerClick])
}
