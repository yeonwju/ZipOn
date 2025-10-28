import { useKakaoLoader as useKakaoLoaderOrigin } from 'react-kakao-maps-sdk'

/**
 * 카카오 지도 API를 로드하는 훅
 * 
 * 이 훅은 react-kakao-maps-sdk의 useKakaoLoader를 래핑한 것으로,
 * 프로젝트에 필요한 카카오 맵 API 설정을 미리 구성해둡니다.
 * 
 * **로드되는 라이브러리:**
 * - clusterer: 마커 클러스터링 (많은 마커를 그룹화)
 * - drawing: 도형 그리기 기능 (원, 다각형, 선 등)
 * - services: 검색, 주소-좌표 변환 등의 서비스
 * 
 * **환경 변수 요구사항:**
 * - NEXT_PUBLIC_KAKAO_MAP_API_KEY: 카카오 개발자 콘솔에서 발급받은 JavaScript 키
 * - .env.local 파일에 저장 필요
 * 
 * **사용 시점:**
 * - 지도를 사용하는 모든 페이지/컴포넌트의 최상위에서 호출
 * - 한 번만 호출하면 전역적으로 적용됨
 * - Next.js App Router의 경우 layout이나 page 최상단에서 호출
 * 
 * **주의사항:**
 * - API 키가 없으면 지도가 로드되지 않음
 * - 개발/배포 환경별로 다른 키 사용 가능
 * - 키는 클라이언트 사이드에서만 접근 가능 (NEXT_PUBLIC_ 접두사 필수)
 * 
 * @example
 * ```tsx
 * // 기본 사용법 - 지도 페이지 최상단
 * export default function MapPage() {
 *   useKakaoLoader() // API 로드
 *   
 *   return (
 *     <Map
 *       center={{ lat: 37.5665, lng: 126.978 }}
 *       level={3}
 *     />
 *   )
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // Layout에서 전역으로 로드
 * export default function RootLayout({ children }) {
 *   useKakaoLoader()
 *   
 *   return (
 *     <html>
 *       <body>{children}</body>
 *     </html>
 *   )
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // 여러 지도 컴포넌트와 함께 사용
 * function App() {
 *   useKakaoLoader()
 *   
 *   return (
 *     <>
 *       <MainMap />
 *       <MiniMap />
 *       <LocationPicker />
 *     </>
 *   )
 * }
 * ```
 */
export default function useKakaoLoader() {
  useKakaoLoaderOrigin({
    // 카카오 개발자 콘솔에서 발급받은 JavaScript 키
    appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY as string,
    // 사용할 카카오맵 라이브러리 목록
    libraries: ['clusterer', 'drawing', 'services'],
  })
}
