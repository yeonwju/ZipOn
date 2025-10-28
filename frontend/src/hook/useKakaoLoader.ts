import { useKakaoLoader as useKakaoLoaderOrigin } from 'react-kakao-maps-sdk'

/**
 * 카카오 지도 API를 로드하는 훅
 * 
 * react-kakao-maps-sdk의 useKakaoLoader를 래핑합니다.
 * clusterer, drawing, services 라이브러리를 자동 로드합니다.
 * 
 * @example
 * export default function MapPage() {
 *   useKakaoLoader()
 *   return <Map ... />
 * }
 */
export default function useKakaoLoader() {
  useKakaoLoaderOrigin({
    // 카카오 개발자 콘솔에서 발급받은 JavaScript 키
    appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY as string,
    // 사용할 카카오맵 라이브러리 목록
    libraries: ['clusterer', 'drawing', 'services'],
  })
}
