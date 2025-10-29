import type { ListingData } from '@/hook/map/useListingMarkers'

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
  // --- 기존 10개 ---
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

  // --- 추가 30개 ---
  {
    name: '역삼동 삼정빌딩',
    address: '서울특별시 강남구 논현로 520',
    lat: 37.5021,
    lng: 127.0399,
    deposit: 4200,
    rent: 230,
  },
  {
    name: '강남N타워',
    address: '서울특별시 강남구 테헤란로 129',
    lat: 37.4975,
    lng: 127.029,
    deposit: 8000,
    rent: 480,
  },
  {
    name: '아남타워빌딩',
    address: '서울특별시 강남구 테헤란로 311',
    lat: 37.5033,
    lng: 127.0393,
    deposit: 9500,
    rent: 520,
  },
  {
    name: '선릉역 삼성빌딩',
    address: '서울특별시 강남구 테헤란로 334',
    lat: 37.5038,
    lng: 127.0445,
    deposit: 8700,
    rent: 480,
  },
  {
    name: '하이리빙빌딩',
    address: '서울특별시 강남구 역삼로 151',
    lat: 37.4993,
    lng: 127.0347,
    deposit: 3600,
    rent: 200,
  },
  {
    name: '대우재단빌딩',
    address: '서울특별시 강남구 역삼로 609',
    lat: 37.5029,
    lng: 127.0359,
    deposit: 10000,
    rent: 600,
  },
  {
    name: '두산건설타워',
    address: '서울특별시 강남구 테헤란로 275',
    lat: 37.5013,
    lng: 127.0395,
    deposit: 12000,
    rent: 700,
  },
  {
    name: '한국타이어빌딩',
    address: '서울특별시 강남구 테헤란로 133',
    lat: 37.4978,
    lng: 127.0302,
    deposit: 9000,
    rent: 540,
  },
  {
    name: '역삼하이츠빌딩',
    address: '서울특별시 강남구 역삼로 120',
    lat: 37.4987,
    lng: 127.0361,
    deposit: 5000,
    rent: 250,
  },
  {
    name: '삼정호텔',
    address: '서울특별시 강남구 봉은사로 150',
    lat: 37.5044,
    lng: 127.0339,
    deposit: 13000,
    rent: 750,
  },
  {
    name: '씨티코어빌딩',
    address: '서울특별시 강남구 테헤란로 346',
    lat: 37.5047,
    lng: 127.0458,
    deposit: 7500,
    rent: 420,
  },
  {
    name: '삼성라온제나',
    address: '서울특별시 강남구 봉은사로 114',
    lat: 37.5027,
    lng: 127.0298,
    deposit: 5500,
    rent: 310,
  },
  {
    name: '한독빌딩',
    address: '서울특별시 강남구 테헤란로 238',
    lat: 37.5009,
    lng: 127.035,
    deposit: 7200,
    rent: 400,
  },
  {
    name: '세방빌딩',
    address: '서울특별시 강남구 논현로 507',
    lat: 37.5005,
    lng: 127.0375,
    deposit: 3800,
    rent: 210,
  },
  {
    name: '강남센트럴빌딩',
    address: '서울특별시 강남구 논현로 543',
    lat: 37.5027,
    lng: 127.0401,
    deposit: 6000,
    rent: 300,
  },
  {
    name: '태양빌딩',
    address: '서울특별시 강남구 논현로 527',
    lat: 37.5018,
    lng: 127.039,
    deposit: 4200,
    rent: 200,
  },
  {
    name: '대치SK뷰',
    address: '서울특별시 강남구 도곡로 416',
    lat: 37.503,
    lng: 127.052,
    deposit: 15000,
    rent: 850,
  },
  {
    name: '삼성현대힐스',
    address: '서울특별시 강남구 삼성로 512',
    lat: 37.5095,
    lng: 127.0502,
    deposit: 20000,
    rent: 1200,
  },
  {
    name: '청림빌딩',
    address: '서울특별시 강남구 테헤란로 310',
    lat: 37.5032,
    lng: 127.0419,
    deposit: 4800,
    rent: 260,
  },
  {
    name: '대림빌딩',
    address: '서울특별시 강남구 논현로 503',
    lat: 37.5003,
    lng: 127.037,
    deposit: 3800,
    rent: 200,
  },
  {
    name: 'LG아트센터빌딩',
    address: '서울특별시 강남구 논현로 508',
    lat: 37.5019,
    lng: 127.0379,
    deposit: 10000,
    rent: 550,
  },
  {
    name: '삼성역 파르나스타워',
    address: '서울특별시 강남구 테헤란로 521',
    lat: 37.5097,
    lng: 127.0603,
    deposit: 18000,
    rent: 1000,
  },
  {
    name: '도곡렉슬',
    address: '서울특별시 강남구 언주로 30',
    lat: 37.4917,
    lng: 127.043,
    deposit: 25000,
    rent: 0,
  },
  {
    name: '역삼역 삼성생명빌딩',
    address: '서울특별시 강남구 테헤란로 427',
    lat: 37.5049,
    lng: 127.0453,
    deposit: 11000,
    rent: 600,
  },
  {
    name: '논현삼익빌딩',
    address: '서울특별시 강남구 논현로 654',
    lat: 37.5051,
    lng: 127.0406,
    deposit: 4800,
    rent: 240,
  },
  {
    name: '삼성동 코엑스몰',
    address: '서울특별시 강남구 영동대로 513',
    lat: 37.5111,
    lng: 127.0584,
    deposit: 20000,
    rent: 1200,
  },
  {
    name: '르메르디앙서울',
    address: '서울특별시 강남구 봉은사로 120',
    lat: 37.505,
    lng: 127.0296,
    deposit: 17000,
    rent: 900,
  },
  {
    name: '논현역 호림아트센터',
    address: '서울특별시 강남구 논현로 836',
    lat: 37.5112,
    lng: 127.0274,
    deposit: 9500,
    rent: 520,
  },
  {
    name: '청담씨티빌딩',
    address: '서울특별시 강남구 학동로 423',
    lat: 37.5231,
    lng: 127.0428,
    deposit: 13000,
    rent: 750,
  },
  {
    name: '도산공원 현대빌딩',
    address: '서울특별시 강남구 논현로 820',
    lat: 37.5183,
    lng: 127.0288,
    deposit: 16000,
    rent: 950,
  },
  {
    name: '압구정 현대아파트',
    address: '서울특별시 강남구 압구정로 312',
    lat: 37.5284,
    lng: 127.0367,
    deposit: 23000,
    rent: 0,
  },
  {
    name: '청담 르씨엘빌딩',
    address: '서울특별시 강남구 도산대로 407',
    lat: 37.5224,
    lng: 127.0396,
    deposit: 12000,
    rent: 650,
  },
  {
    name: '논현 팍스타워',
    address: '서울특별시 강남구 학동로 343',
    lat: 37.5195,
    lng: 127.0348,
    deposit: 8000,
    rent: 450,
  },
  {
    name: '강남 그린빌딩',
    address: '서울특별시 강남구 언주로 530',
    lat: 37.5071,
    lng: 127.0432,
    deposit: 4800,
    rent: 260,
  },
]
