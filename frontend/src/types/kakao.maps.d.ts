/**
 * Kakao Maps API TypeScript 정의
 *
 * 카카오맵 JavaScript API를 TypeScript에서 사용하기 위한 타입 정의 파일입니다.
 *
 * @see https://apis.map.kakao.com/web/documentation/
 */

// ============================================================
// Global Window Interface
// ============================================================

declare global {
  interface Window {
    kakao: {
      maps: KakaoMapsStatic
    }
  }
}

interface KakaoMapsStatic {
  Map: new (container: HTMLElement, options: kakao.maps.MapOptions) => kakao.maps.Map
  LatLng: new (lat: number, lng: number) => kakao.maps.LatLng
  Size: new (width: number, height: number) => kakao.maps.Size
  Point: new (x: number, y: number) => kakao.maps.Point
  LatLngBounds: new () => kakao.maps.LatLngBounds
  Marker: new (options: kakao.maps.MarkerOptions) => kakao.maps.Marker
  MarkerImage: new (
    src: string,
    size: kakao.maps.Size,
    options?: kakao.maps.MarkerImageOptions
  ) => kakao.maps.MarkerImage
  CustomOverlay: new (options: kakao.maps.CustomOverlayOptions) => kakao.maps.CustomOverlay
  InfoWindow: new (options: kakao.maps.InfoWindowOptions) => kakao.maps.InfoWindow
  MarkerClusterer: new (options: kakao.maps.MarkerClustererOptions) => kakao.maps.MarkerClusterer
  event: {
    addListener: (
      target: kakao.maps.Map | kakao.maps.Marker | unknown,
      type: string,
      callback: (event?: kakao.maps.event.MouseEvent | kakao.maps.Cluster | unknown) => void
    ) => void
    removeListener: (
      target: kakao.maps.Map | kakao.maps.Marker | unknown,
      type: string,
      callback: (event?: kakao.maps.event.MouseEvent | kakao.maps.Cluster | unknown) => void
    ) => void
  }
}

// ============================================================
// Kakao Maps Namespace
// ============================================================

export declare namespace kakao {
  namespace maps {
    // ========================================
    // 1. 기본 타입 (Basic Types)
    // ========================================

    /**
     * 좌표 객체
     *
     * 위도(latitude)와 경도(longitude)를 나타내는 객체입니다.
     *
     * @example
     * ```typescript
     * // 좌표 생성
     * const position = new window.kakao.maps.LatLng(37.5665, 126.9780)
     *
     * // 좌표 읽기
     * const lat = position.getLat() // 37.5665
     * const lng = position.getLng() // 126.9780
     * ```
     */
    class LatLng {
      constructor(lat: number, lng: number)
      getLat(): number
      getLng(): number
    }

    /**
     * 영역 객체
     *
     * 지도 영역을 나타내는 사각형 경계 박스입니다.
     *
     * @example
     * ```typescript
     * const bounds = new window.kakao.maps.LatLngBounds()
     * bounds.extend(new window.kakao.maps.LatLng(37.5665, 126.9780))
     * bounds.extend(new window.kakao.maps.LatLng(37.5700, 126.9850))
     *
     * const sw = bounds.getSouthWest() // 남서쪽 좌표
     * const ne = bounds.getNorthEast() // 북동쪽 좌표
     * ```
     */
    class LatLngBounds {
      constructor()
      extend(latlng: LatLng): void
      getSouthWest(): LatLng
      getNorthEast(): LatLng
      isEmpty(): boolean
    }

    /**
     * 크기 객체
     *
     * 픽셀 단위의 너비와 높이를 나타냅니다.
     *
     * @example
     * ```typescript
     * const size = new window.kakao.maps.Size(50, 50)
     * ```
     */
    class Size {
      constructor(width: number, height: number)
    }

    /**
     * 좌표 객체 (픽셀)
     *
     * 화면상의 픽셀 좌표를 나타냅니다.
     *
     * @example
     * ```typescript
     * const point = new window.kakao.maps.Point(10, 20)
     * const x = point.getX() // 10
     * const y = point.getY() // 20
     * ```
     */
    class Point {
      constructor(x: number, y: number)
      getX(): number
      getY(): number
    }

    // ========================================
    // 2. 지도 관련 (Map)
    // ========================================

    /**
     * 지도 객체
     *
     * 카카오맵의 핵심 객체로, 지도를 생성하고 제어합니다.
     *
     * @example
     * ```typescript
     * const container = document.getElementById('map')
     * const options = {
     *   center: new window.kakao.maps.LatLng(37.5665, 126.9780),
     *   level: 3 // 확대 레벨 (1~14)
     * }
     * const map = new window.kakao.maps.Map(container, options)
     *
     * // 지도 중심 이동
     * map.setCenter(new window.kakao.maps.LatLng(37.5700, 126.9850))
     *
     * // 줌 레벨 변경
     * map.setLevel(5)
     * ```
     */
    class Map {
      constructor(container: HTMLElement, options: MapOptions)
      setCenter(latlng: LatLng): void
      getCenter(): LatLng
      setLevel(level: number): void
      getLevel(): number
      addOverlayMapTypeId(typeId: MapTypeId): void
      removeOverlayMapTypeId(typeId: MapTypeId): void
    }

    /**
     * 지도 설정 옵션
     *
     * @property center - 지도 중심 좌표 (필수)
     * @property level - 확대 레벨 (1~14, 기본값: 3)
     * @property draggable - 드래그 가능 여부 (기본값: true)
     * @property scrollwheel - 마우스 휠로 줌 가능 여부 (기본값: true)
     * @property disableDoubleClickZoom - 더블클릭 줌 비활성화 (기본값: false)
     */
    interface MapOptions {
      center: LatLng
      level?: number
      draggable?: boolean
      scrollwheel?: boolean
      disableDoubleClickZoom?: boolean
    }

    /**
     * 지도 타입
     *
     * @example
     * ```typescript
     * // 스카이뷰 추가
     * map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.SKYVIEW)
     *
     * // 스카이뷰 제거
     * map.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.SKYVIEW)
     * ```
     */
    enum MapTypeId {
      ROADMAP = 'ROADMAP', // 일반 지도
      SKYVIEW = 'SKYVIEW', // 스카이뷰
      HYBRID = 'HYBRID', // 하이브리드 (스카이뷰 + 라벨)
      ROADVIEW = 'ROADVIEW', // 로드뷰
      OVERLAY = 'OVERLAY', // 오버레이
    }

    // ========================================
    // 3. 마커 관련 (Marker)
    // ========================================

    /**
     * 마커 객체
     *
     * 지도 위에 표시되는 핀 마커입니다.
     *
     * @example
     * ```typescript
     * // 기본 마커 생성
     * const marker = new window.kakao.maps.Marker({
     *   map: map,
     *   position: new window.kakao.maps.LatLng(37.5665, 126.9780),
     *   title: '서울시청'
     * })
     *
     * // 마커 위치 변경
     * marker.setPosition(new window.kakao.maps.LatLng(37.5700, 126.9850))
     *
     * // 마커 제거
     * marker.setMap(null)
     *
     * // 커스텀 이미지 마커
     * const imageSize = new window.kakao.maps.Size(40, 40)
     * const markerImage = new window.kakao.maps.MarkerImage('/marker.png', imageSize)
     * const customMarker = new window.kakao.maps.Marker({
     *   map: map,
     *   position: new window.kakao.maps.LatLng(37.5665, 126.9780),
     *   image: markerImage
     * })
     * ```
     */
    class Marker {
      constructor(options: MarkerOptions)
      setMap(map: Map | null): void
      setPosition(position: LatLng): void
      getPosition(): LatLng
    }

    /**
     * 마커 설정 옵션
     *
     * @property map - 마커를 표시할 지도 객체
     * @property position - 마커 위치 (필수)
     * @property title - 마커 타이틀 (호버 시 표시)
     * @property image - 커스텀 마커 이미지
     * @property clickable - 클릭 가능 여부 (기본값: true)
     */
    interface MarkerOptions {
      map?: Map
      position: LatLng
      title?: string
      image?: MarkerImage
      clickable?: boolean
    }

    /**
     * 마커 이미지 객체
     *
     * 커스텀 마커 이미지를 설정합니다.
     *
     * @example
     * ```typescript
     * const imageSize = new window.kakao.maps.Size(40, 40)
     * const imageOption = { offset: new window.kakao.maps.Point(20, 40) }
     * const markerImage = new window.kakao.maps.MarkerImage(
     *   '/marker.png',
     *   imageSize,
     *   imageOption
     * )
     * ```
     */
    class MarkerImage {
      constructor(src: string, size: Size, options?: MarkerImageOptions)
    }

    /**
     * 마커 이미지 설정 옵션
     *
     * @property offset - 이미지 오프셋 (중심점 조정)
     * @property alt - 대체 텍스트
     * @property shape - 이미지 모양
     * @property coords - 좌표값
     * @property spriteOrigin - 스프라이트 이미지 원점
     * @property spriteSize - 스프라이트 이미지 크기
     */
    interface MarkerImageOptions {
      offset?: Point
      alt?: string
      shape?: string
      coords?: string
      spriteOrigin?: Point
      spriteSize?: Size
    }

    // ========================================
    // 4. 오버레이 관련 (Overlay)
    // ========================================

    /**
     * 커스텀 오버레이 객체
     *
     * HTML 콘텐츠를 지도 위에 표시합니다.
     *
     * @example
     * ```typescript
     * // 말풍선 오버레이 생성
     * const content = `
     *   <div style="padding:10px; background:white; border-radius:8px;">
     *     <h4>서울시청</h4>
     *     <p>서울특별시 중구 세종대로 110</p>
     *   </div>
     * `
     * const overlay = new window.kakao.maps.CustomOverlay({
     *   map: map,
     *   position: new window.kakao.maps.LatLng(37.5665, 126.9780),
     *   content: content,
     *   yAnchor: 1 // 말풍선 끝이 좌표에 오도록 설정
     * })
     *
     * // 오버레이 숨기기/보이기
     * overlay.setVisible(false)
     * overlay.setVisible(true)
     *
     * // 오버레이 제거
     * overlay.setMap(null)
     * ```
     */
    class CustomOverlay {
      constructor(options: CustomOverlayOptions)
      setMap(map: Map | null): void
      setPosition(position: LatLng): void
      getMap(): Map | null
      getPosition(): LatLng
      setContent(content: HTMLElement | string): void
      setVisible(visible: boolean): void
      getVisible(): boolean
      setZIndex(zIndex: number): void
      getZIndex(): number
    }

    /**
     * 커스텀 오버레이 설정 옵션
     *
     * @property map - 오버레이를 표시할 지도 객체
     * @property position - 오버레이 위치 (필수)
     * @property content - HTML 콘텐츠 (필수)
     * @property xAnchor - X축 앵커 (0~1, 기본값: 0.5)
     * @property yAnchor - Y축 앵커 (0~1, 기본값: 0.5)
     * @property clickable - 클릭 가능 여부
     * @property zIndex - z-index 값
     */
    interface CustomOverlayOptions {
      map?: Map
      position: LatLng
      content: HTMLElement | string
      xAnchor?: number
      yAnchor?: number
      clickable?: boolean
      zIndex?: number
    }

    /**
     * 인포윈도우 객체
     *
     * 마커 위에 정보를 표시하는 말풍선 창입니다.
     *
     * @example
     * ```typescript
     * const infowindow = new window.kakao.maps.InfoWindow({
     *   content: '<div style="padding:10px;">서울시청</div>'
     * })
     * infowindow.open(map, marker)
     * ```
     */
    class InfoWindow {
      constructor(options: InfoWindowOptions)
      open(map: Map, marker: Marker): void
      close(): void
      setContent(content: string | HTMLElement): void
      setPosition(position: LatLng): void
      setZIndex(zIndex: number): void
    }

    /**
     * 인포윈도우 설정 옵션
     *
     * @property content - HTML 콘텐츠 (필수)
     * @property position - 인포윈도우 위치
     * @property removable - 닫기 버튼 표시 여부
     * @property zIndex - z-index 값
     */
    interface InfoWindowOptions {
      content: string | HTMLElement
      position?: LatLng
      removable?: boolean
      zIndex?: number
    }

    // ========================================
    // 5. 클러스터 관련 (Clustering)
    // ========================================

    /**
     * 마커 클러스터러 객체
     *
     * 다수의 마커를 그룹화하여 클러스터로 표시합니다.
     *
     * @example
     * ```typescript
     * // 마커 배열 생성
     * const markers = positions.map(pos =>
     *   new window.kakao.maps.Marker({
     *     position: new window.kakao.maps.LatLng(pos.lat, pos.lng)
     *   })
     * )
     *
     * // 클러스터러 생성
     * const clusterer = new window.kakao.maps.MarkerClusterer({
     *   map: map,
     *   markers: markers,
     *   gridSize: 60, // 클러스터 그리드 크기
     *   averageCenter: true, // 클러스터 중심을 평균으로 계산
     *   minLevel: 4, // 클러스터가 표시될 최소 레벨
     *   styles: [{
     *     width: '50px',
     *     height: '50px',
     *     background: 'rgba(255, 0, 0, 0.8)',
     *     borderRadius: '25px',
     *     color: '#fff',
     *     textAlign: 'center',
     *     lineHeight: '50px'
     *   }]
     * })
     *
     * // 클러스터 클릭 이벤트
     * window.kakao.maps.event.addListener(clusterer, 'clusterclick', (cluster) => {
     *   const markers = cluster.getMarkers()
     *   console.log('클러스터 마커 개수:', markers.length)
     * })
     * ```
     */
    class MarkerClusterer {
      constructor(options: MarkerClustererOptions)
      addMarker(marker: Marker, nodraw?: boolean): void
      addMarkers(markers: Marker[], nodraw?: boolean): void
      removeMarker(marker: Marker, nodraw?: boolean): void
      removeMarkers(markers: Marker[], nodraw?: boolean): void
      clear(): void
      redraw(): void
      setMinClusterSize(size: number): void
      getMinClusterSize(): number
      setAverageCenter(bool: boolean): void
      getAverageCenter(): boolean
      setMinLevel(level: number): void
      getMinLevel(): number
      setTexts(texts: string[] | ((size: number) => string)): void
      setCalculator(calculator: (sizes: number[]) => number[]): void
      setStyles(styles: ClusterStyle[]): void
      getStyles(): ClusterStyle[]
      getClusters(): Cluster[]
    }

    /**
     * 마커 클러스터러 설정 옵션
     *
     * @property map - 클러스터를 표시할 지도 객체 (필수)
     * @property markers - 클러스터링할 마커 배열
     * @property gridSize - 클러스터 그리드 크기 (기본값: 60)
     * @property averageCenter - 클러스터 중심을 평균으로 계산 (기본값: false)
     * @property minLevel - 클러스터가 표시될 최소 레벨 (기본값: 0)
     * @property minClusterSize - 클러스터로 묶일 최소 마커 개수 (기본값: 2)
     * @property styles - 클러스터 스타일 배열
     * @property texts - 클러스터에 표시될 텍스트
     * @property calculator - 클러스터 크기 계산 함수
     * @property disableClickZoom - 클릭 시 줌 비활성화 (기본값: false)
     * @property clickable - 클릭 가능 여부 (기본값: true)
     * @property hoverable - 호버 가능 여부 (기본값: false)
     */
    interface MarkerClustererOptions {
      map: Map
      markers?: Marker[]
      gridSize?: number
      averageCenter?: boolean
      minLevel?: number
      minClusterSize?: number
      styles?: ClusterStyle[]
      texts?: string[] | ((size: number) => string)
      calculator?: (sizes: number[]) => number[]
      disableClickZoom?: boolean
      clickable?: boolean
      hoverable?: boolean
    }

    /**
     * 클러스터 스타일
     *
     * 클러스터 마커의 외형을 정의합니다.
     */
    interface ClusterStyle {
      width: string
      height: string
      background: string
      borderRadius?: string
      color: string
      textAlign?: string
      lineHeight?: string
      fontWeight?: string
      fontSize?: string
    }

    /**
     * 클러스터 객체
     *
     * 그룹화된 마커들의 정보를 담고 있습니다.
     */
    interface Cluster {
      getCenter(): LatLng
      getBounds(): LatLngBounds
      getMarkers(): Marker[]
      getClusterMarker(): Marker
    }

    // ========================================
    // 6. 이벤트 관련 (Events)
    // ========================================

    /**
     * 이벤트 네임스페이스
     *
     * 지도, 마커, 오버레이 등의 이벤트를 처리합니다.
     *
     * @example
     * ```typescript
     * // 지도 클릭 이벤트
     * window.kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
     *   const latlng = mouseEvent.latLng
     *   console.log('클릭 위치:', latlng.getLat(), latlng.getLng())
     * })
     *
     * // 마커 클릭 이벤트
     * window.kakao.maps.event.addListener(marker, 'click', () => {
     *   console.log('마커 클릭됨')
     * })
     *
     * // 줌 레벨 변경 이벤트
     * window.kakao.maps.event.addListener(map, 'zoom_changed', () => {
     *   const level = map.getLevel()
     *   console.log('줌 레벨:', level)
     * })
     *
     * // 지도 이동 이벤트
     * window.kakao.maps.event.addListener(map, 'center_changed', () => {
     *   const center = map.getCenter()
     *   console.log('중심 좌표:', center.getLat(), center.getLng())
     * })
     * ```
     */
    namespace event {
      /**
       * 마우스 이벤트 객체
       *
       * @property latLng - 클릭한 위치의 좌표
       */
      interface MouseEvent {
        latLng: LatLng
      }

      /**
       * 이벤트 리스너 등록
       *
       * @param target - 이벤트를 등록할 객체
       * @param type - 이벤트 타입 ('click', 'zoom_changed', 'center_changed' 등)
       * @param callback - 이벤트 콜백 함수
       */
      function addListener(
        target: Map | Marker | LatLng | Size | Point | HTMLElement,
        type: string,
        callback: (event: MouseEvent) => void
      ): void

      /**
       * 이벤트 리스너 제거
       *
       * @param target - 이벤트를 제거할 객체
       * @param type - 이벤트 타입
       * @param callback - 제거할 콜백 함수
       */
      export function removeListener(current: string) {
        throw new Error('Function not implemented.')
      }
    }

    // ========================================
    // 7. 유틸리티 함수
    // ========================================

    /**
     * 카카오맵 SDK 로드 함수
     *
     * @param callback - SDK 로드 완료 후 실행할 콜백
     */
    export function load(arg0: () => void): void
  }
}

export {}
