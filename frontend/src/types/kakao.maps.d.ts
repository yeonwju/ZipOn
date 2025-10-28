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
  CustomOverlay: new (options: kakao.maps.CustomOverlayOptions) => kakao.maps.CustomOverlay
  Marker: new (options: kakao.maps.MarkerOptions) => kakao.maps.Marker
  MarkerClusterer: new (options: kakao.maps.MarkerClustererOptions) => kakao.maps.MarkerClusterer
  event: {
    addListener: (
      target: kakao.maps.Map | kakao.maps.Marker | unknown,
      type: string,
      callback: (event?: kakao.maps.event.MouseEvent) => void
    ) => void
    removeListener: (
      target: kakao.maps.Map | kakao.maps.Marker | unknown,
      type: string,
      callback: (event?: kakao.maps.event.MouseEvent) => void
    ) => void
  }
}

export declare namespace kakao {
  namespace maps {
    /** 좌표 객체 */
    class LatLng {
      constructor(lat: number, lng: number)
      getLat(): number
      getLng(): number
    }

    /** 지도 컨테이너 */
    class Map {
      constructor(container: HTMLElement, options: MapOptions)
      setCenter(latlng: LatLng): void
      getCenter(): LatLng
      setLevel(level: number): void
      getLevel(): number
      addOverlayMapTypeId(typeId: MapTypeId): void
      removeOverlayMapTypeId(typeId: MapTypeId): void
    }

    /** 지도 설정 */
    interface MapOptions {
      center: LatLng
      level?: number
      draggable?: boolean
      scrollwheel?: boolean
      disableDoubleClickZoom?: boolean
    }

    /** 마커 */
    class Marker {
      constructor(options: MarkerOptions)
      setMap(map: Map | null): void
      setPosition(position: LatLng): void
    }

    interface MarkerOptions {
      map?: Map
      position: LatLng
      title?: string
      image?: MarkerImage
      clickable?: boolean
    }

    /** 마커 이미지 */
    class MarkerImage {
      constructor(src: string, size: Size, options?: MarkerImageOptions)
    }

    interface MarkerImageOptions {
      offset?: Point
      alt?: string
      shape?: string
      coords?: string
      spriteOrigin?: Point
      spriteSize?: Size
    }

    /** 좌표 객체 */
    class Point {
      constructor(x: number, y: number)
      getX(): number
      getY(): number
    }

    /** 지도 타입 ID */
    enum MapTypeId {
      ROADMAP = 'ROADMAP',
      SKYVIEW = 'SKYVIEW',
      HYBRID = 'HYBRID',
      ROADVIEW = 'ROADVIEW',
      OVERLAY = 'OVERLAY',
    }

    /** 크기 객체 */
    class Size {
      constructor(width: number, height: number)
    }

    /** 커스텀 오버레이 */
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

    interface CustomOverlayOptions {
      map?: Map
      position: LatLng
      content: HTMLElement | string
      xAnchor?: number
      yAnchor?: number
      clickable?: boolean
      zIndex?: number
    }

    /** 마커 클러스터러 */
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
    }

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

    /** 이벤트 리스너 */
    namespace event {
      interface MouseEvent {
        latLng: LatLng
      }

      function addListener(
        target: Map | Marker | LatLng | Size | Point | HTMLElement,
        type: string,
        callback: (event: MouseEvent) => void
      ): void

      export function removeListener(current: string) {
        throw new Error('Function not implemented.')
      }
    }

    export function load(arg0: () => void): void
  }
}

export {}
