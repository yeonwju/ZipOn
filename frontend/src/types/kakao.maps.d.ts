// src/types/kakao.maps.d.ts

declare global {
  interface Window {
    kakao: {
      maps: {
        Map: typeof Map
        LatLng: typeof LatLng
        CustomOverlay: typeof CustomOverlay
        [key: string]: any
      }
    }
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

      export function removeListener(current: any) {
        throw new Error('Function not implemented.')
      }
    }

    export function load(arg0: () => void): void
  }
}

export {}
