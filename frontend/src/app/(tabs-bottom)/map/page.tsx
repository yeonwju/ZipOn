'use client'

import { useState } from 'react'
import { Map } from 'react-kakao-maps-sdk'

import SearchBar from '@/components/layout/SearchBar'
import { BuildingData } from '@/data/Building'
import useKakaoLoader from '@/hook/useKakaoLoader'
import useListingMarkers from '@/hook/useListingMarkers'
import useUserLocation from '@/hook/useUserLocation'
import useUserMarker from '@/hook/useUserMarker'
import type { kakao } from '@/types/kakao.maps'

/**
 * 지도 페이지 메인 컴포넌트
 *
 * 이 페이지는 카카오 지도를 사용하여 사용자의 현재 위치와
 * 주변 매물 정보를 시각적으로 표시합니다.
 *
 * **주요 기능:**
 * 1. GPS 기반 현재 위치 추적 및 표시
 * 2. 현재 위치에 파란색 파동 마커 표시
 * 3. 매물 위치에 주황색 집 마커 표시
 * 4. 마커 클릭 시 매물 정보 표시 (모달)
 * 5. 지도 상단 검색 바 UI
 *
 * **마커 종류:**
 * - 파란색 파동 마커: 사용자 현재 위치 (useUserMarker)
 * - 주황색 집 마커: 매물 위치들 (useListingMarkers)
 *
 * **데이터 흐름:**
 * 1. useKakaoLoader: 카카오맵 API 로드
 * 2. useUserLocation: GPS로 현재 위치 가져오기
 * 3. Map 컴포넌트: 지도 인스턴스 생성 (onCreate로 setMap)
 * 4. useUserMarker: 현재 위치 마커 생성
 * 5. useListingMarkers: 매물 마커들 생성
 *
 * **사용된 훅:**
 * @see useKakaoLoader - 카카오 맵 SDK 로드 (API 초기화)
 * @see useUserLocation - GPS 위치 정보 가져오기 (실시간 추적)
 * @see useUserMarker - 단일 커스텀 마커 생성 (현재 위치)
 * @see useListingMarkers - 다중 매물 마커 생성 (매물 목록)
 *
 * @example
 * ```tsx
 * // 이 컴포넌트 사용법
 * import MapPage from '@/app/(tabs-bottom)/map/page'
 *
 * // /map 경로로 접근하면 자동으로 렌더링됨
 * ```
 */
export default function BasicMap() {
  // 1. 카카오 맵 SDK 로드 (가장 먼저 실행되어야 함)
  useKakaoLoader()

  // 2. GPS로 사용자의 현재 위치 가져오기
  // location: { lat: number, lng: number, accuracy?: number } | null
  const { location } = useUserLocation()

  // 3. 지도 인스턴스를 관리하는 state
  // Map 컴포넌트의 onCreate 콜백으로 실제 지도 객체를 받아옴
  const [map, setMap] = useState<kakao.maps.Map | null>(null)

  // 4. 기본 중심 좌표 (제주도) - GPS 위치를 가져오기 전 임시로 사용
  const defaultCenter = { lat: 33.450701, lng: 126.570667 }

  /**
   * 5. GPS 위치에 사용자 위치 마커 생성
   *
   * - 파란색 중앙 원과 파동 효과로 구성
   * - location이 null이면 마커가 표시되지 않음
   * - 위치가 업데이트되면 마커도 자동으로 이동
   * - 클릭 시 콘솔에 로그 출력
   */
  useUserMarker(map, location, () => console.log('내 위치 마커 클릭됨!'))

  /**
   * 6. 매물 마커들 생성 및 관리
   *
   * - BuildingData의 모든 매물 위치에 마커 생성
   * - 각 마커는 집 아이콘과 가격 정보 표시
   * - 클릭 시 해당 매물 정보를 콜백으로 받음
   * - TODO: 클릭 시 커스텀 모달을 열어 상세 정보 표시
   */
  useListingMarkers(map, BuildingData, listing => {
    console.log('매물 클릭됨:', listing)
    // TODO: 여기에 커스텀 모달 열기 로직 추가
    // 예: setSelectedListing(listing)
  })

  /**
   * 향후 기능: 지도 중심 추적
   *
   * 사용자가 지도를 이동할 때마다 중심 좌표를 추적하여
   * 해당 영역의 매물을 다시 불러오는 기능을 구현하려면
   * useMapCenter Hook을 사용하세요.
   *
   * @example
   * ```tsx
   * import useMapCenter from '@/hook/useMapCenter'
   *
   * const center = useMapCenter(map, defaultCenter, 1000)
   *
   * useEffect(() => {
   *   // 지도 중심이 변경되면 해당 영역의 매물 불러오기
   *   if (center) {
   *     fetchListingsInArea(center.lat, center.lng, radius)
   *   }
   * }, [center])
   * ```
   */

  return (
    <div className="relative h-screen w-full">
      {/* 
        7. 카카오 지도 컴포넌트 (react-kakao-maps-sdk)
        
        Props:
        - id: DOM 요소 ID (디버깅/테스트 용도)
        - center: 지도 중심 좌표 (GPS 위치 우선, 없으면 defaultCenter)
        - style: 지도 크기 (부모 요소 전체 채우기)
        - level: 확대/축소 레벨 (1-14, 낮을수록 확대)
        - className: 배치를 위한 CSS 클래스
        - onCreate: 지도 생성 완료 시 콜백 (map 인스턴스 반환)
                    이 콜백으로 받은 map을 useState로 저장하여
                    다른 훅들(useUserMarker, useListingMarkers)에서 사용
      */}
      <Map
        id="map"
        center={location || defaultCenter}
        style={{ width: '100%', height: '100%' }}
        level={3}
        className="absolute inset-0 z-0"
        onCreate={setMap}
      />

      {/* 
        8. 지도 위 UI 레이어 - 검색 바
        
        - pointer-events-none: 전체 레이어는 클릭 불가 (지도 조작 가능)
        - pointer-events-auto: 검색 바만 클릭 가능
        - absolute positioning: 지도 위에 겹쳐서 표시
        - z-index: 지도(z-0) 위에 표시
      */}
      <div className="pointer-events-none absolute inset-0">
        <div className="pointer-events-auto absolute top-1 left-1 z-10 w-full pr-2">
          <SearchBar />
        </div>
      </div>
    </div>
  )
}
