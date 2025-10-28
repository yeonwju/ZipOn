import type { ListingData } from '@/hook/useListingMarkers'

/**
 * 건물 매물 샘플 데이터
 *
 * 이 파일은 강남역 주변 주요 건물들의 위치와 가격 정보를 담고 있습니다.
 * 실제 프로젝트에서는 이 데이터를 API에서 받아오도록 대체해야 합니다.
 *
 * **데이터 타입:**
 * - ListingData 타입 사용 (@/hook/useListingMarkers에서 정의)
 *
 * **데이터 구조:**
 * - name: 건물명
 * - address: 도로명 주소
 * - lat: 위도 (latitude) - 카카오맵 좌표계
 * - lng: 경도 (longitude) - 카카오맵 좌표계
 * - deposit: 보증금 (단위: 만원)
 * - rent: 월세 (단위: 만원, 0이면 전세)
 *
 * **사용 예시:**
 * ```tsx
 * // 지도에 매물 마커 표시
 * useListingMarkers(map, BuildingData)
 *
 * // API 데이터로 대체하기
 * const { data: listings } = useQuery('listings', fetchListings)
 * useListingMarkers(map, listings ?? BuildingData) // fallback으로 사용
 * ```
 *
 * **TODO:**
 * - 실제 API 엔드포인트 연결
 * - 지역별 필터링 추가
 * - 가격 범위 필터링 추가
 * - 페이지네이션 구현
 */
export const BuildingData: ListingData[] = [
  {
    name: 'GS타워',
    address: '서울특별시 강남구 논현로 508',
    lat: 37.5012743,
    lng: 127.039585,
    deposit: 10000,
    rent: 550,
  },
  {
    name: '메리츠타워',
    address: '서울특별시 강남구 강남대로 382',
    lat: 37.500857,
    lng: 127.035512,
    deposit: 8000,
    rent: 450,
  },
  {
    name: '르네상스호텔(현 르네상스사거리 빌딩)',
    address: '서울특별시 강남구 테헤란로 390',
    lat: 37.504198,
    lng: 127.043081,
    deposit: 12000,
    rent: 700,
  },
  {
    name: '삼성 SDS 타워',
    address: '서울특별시 강남구 테헤란로 125',
    lat: 37.496668,
    lng: 127.028488,
    deposit: 9000,
    rent: 500,
  },
  {
    name: '마루180',
    address: '서울특별시 강남구 역삼로 180',
    lat: 37.499948,
    lng: 127.036589,
    deposit: 3000,
    rent: 180,
  },
  {
    name: '역삼역 센트럴푸르지오시티',
    address: '서울특별시 강남구 역삼동 832-7',
    lat: 37.499457,
    lng: 127.036143,
    deposit: 5000,
    rent: 220,
  },
  {
    name: '강남파이낸스센터(GFC)',
    address: '서울특별시 강남구 테헤란로 152',
    lat: 37.500078,
    lng: 127.035283,
    deposit: 15000,
    rent: 800,
  },
  {
    name: '국민은행 강남역지점',
    address: '서울특별시 강남구 테헤란로 120',
    lat: 37.497927,
    lng: 127.028361,
    deposit: 4000,
    rent: 200,
  },
  {
    name: '포스코타워 역삼',
    address: '서울특별시 강남구 테헤란로 298',
    lat: 37.501964,
    lng: 127.042207,
    deposit: 13000,
    rent: 750,
  },
  {
    name: '역삼SK허브',
    address: '서울특별시 강남구 논현로85길 5',
    lat: 37.501152,
    lng: 127.036431,
    deposit: 3500,
    rent: 190,
  },
]
