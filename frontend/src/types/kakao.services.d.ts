/**
 * Kakao Maps Services API TypeScript 정의
 *
 * react-kakao-maps-sdk에 포함되지 않은 services API 타입 정의
 */

declare global {
  interface Window {
    kakao: {
      maps: {
        services: {
          Geocoder: new () => KakaoGeocoder
          Status: {
            OK: string
            ZERO_RESULT: string
            ERROR: string
          }
        }
        LatLng: new (lat: number, lng: number) => KakaoLatLng
        Map: new (container: HTMLElement, options: KakaoMapOptions) => KakaoMap
        Marker: new (options: KakaoMarkerOptions) => KakaoMarker
        CustomOverlay: new (options: KakaoCustomOverlayOptions) => KakaoCustomOverlay
        LatLngBounds: new () => KakaoLatLngBounds
        Size: new (width: number, height: number) => KakaoSize
        MarkerImage: new (src: string, size: KakaoSize, options?: KakaoMarkerImageOptions) => KakaoMarkerImage
        MarkerClusterer: new (options: KakaoMarkerClustererOptions) => KakaoMarkerClusterer
        event: {
          addListener: (
            target: KakaoMap | KakaoMarker | KakaoMarkerClusterer,
            type: string,
            handler: (event?: KakaoMouseEvent | KakaoCluster) => void
          ) => void
          removeListener: (
            target: KakaoMap | KakaoMarker | KakaoMarkerClusterer,
            type: string,
            handler: (event?: KakaoMouseEvent | KakaoCluster) => void
          ) => void
        }
      }
    }
  }

  // LatLng 타입
  interface KakaoLatLng {
    getLat(): number
    getLng(): number
  }

  // Map 옵션 타입
  interface KakaoMapOptions {
    center: KakaoLatLng
    level?: number
    draggable?: boolean
    scrollwheel?: boolean
    disableDoubleClick?: boolean
    disableDoubleClickZoom?: boolean
  }

  // Map 타입
  interface KakaoMap {
    setCenter(latlng: KakaoLatLng): void
    getCenter(): KakaoLatLng
    setLevel(level: number, options?: { animate?: boolean; anchor?: KakaoLatLng }): void
    getLevel(): number
    panTo(latlng: KakaoLatLng): void
    setBounds(bounds: KakaoLatLngBounds): void
    getBounds(): KakaoLatLngBounds
  }

  // Marker 옵션 타입
  interface KakaoMarkerOptions {
    position: KakaoLatLng
    map?: KakaoMap
    image?: KakaoMarkerImage
    title?: string
    draggable?: boolean
    clickable?: boolean
    zIndex?: number
    opacity?: number
    buildingType?: string
    isAuction?: boolean
  }

  // Marker 타입
  interface KakaoMarker {
    setMap(map: KakaoMap | null): void
    getPosition(): KakaoLatLng
    setPosition(position: KakaoLatLng): void
    setImage(image: KakaoMarkerImage): void
    setZIndex(zIndex: number): void
    setOpacity(opacity: number): void
    setDraggable(draggable: boolean): void
  }

  // CustomOverlay 옵션 타입
  interface KakaoCustomOverlayOptions {
    position: KakaoLatLng
    content: HTMLElement | string
    map?: KakaoMap
    xAnchor?: number
    yAnchor?: number
    zIndex?: number
    clickable?: boolean
  }

  // CustomOverlay 타입
  interface KakaoCustomOverlay {
    setMap(map: KakaoMap | null): void
    getPosition(): KakaoLatLng
    setPosition(position: KakaoLatLng): void
    setContent(content: HTMLElement | string): void
    setZIndex(zIndex: number): void
  }

  // LatLngBounds 타입
  interface KakaoLatLngBounds {
    extend(latlng: KakaoLatLng): void
    contain(latlng: KakaoLatLng): boolean
    isEmpty(): boolean
    getSouthWest(): KakaoLatLng
    getNorthEast(): KakaoLatLng
  }

  // Size 타입
  interface KakaoSize {
    width: number
    height: number
  }

  // MarkerImage 옵션 타입
  interface KakaoMarkerImageOptions {
    offset?: { x: number; y: number }
    alt?: string
    coords?: string
    shape?: string
  }

  // MarkerImage 타입
  interface KakaoMarkerImage {
    src: string
    size: KakaoSize
  }

  // MarkerClusterer 옵션 타입
  interface KakaoMarkerClustererOptions {
    map: KakaoMap
    markers?: KakaoMarker[]
    gridSize?: number
    averageCenter?: boolean
    minLevel?: number
    minClusterSize?: number
    disableClickZoom?: boolean
    clickable?: boolean
    styles?: KakaoClusterStyle[]
  }

  // Cluster 스타일 타입
  interface KakaoClusterStyle {
    width: string
    height: string
    background: string
    borderRadius: string
    color: string
    textAlign: string
    lineHeight: string
    fontWeight: string
    fontSize: string
  }

  // MarkerClusterer 타입
  interface KakaoMarkerClusterer {
    addMarker(marker: KakaoMarker): void
    removeMarker(marker: KakaoMarker): void
    addMarkers(markers: KakaoMarker[]): void
    removeMarkers(markers: KakaoMarker[]): void
    clear(): void
    redraw(): void
    setMap(map: KakaoMap | null): void
  }

  // Cluster 타입 (클러스터 클릭 이벤트에서 사용)
  interface KakaoCluster {
    getMarkers(): KakaoMarker[]
    getCenter(): KakaoLatLng
    getBounds(): KakaoLatLngBounds
  }

  // MouseEvent 타입 (지도/마커 클릭 이벤트에서 사용)
  interface KakaoMouseEvent {
    latLng: KakaoLatLng
    point: {
      x: number
      y: number
    }
  }

  interface KakaoGeocoder {
    addressSearch(
      address: string,
      callback: (result: AddressSearchResult[], status: string) => void
    ): void

    coord2Address(
      lng: number,
      lat: number,
      callback: (result: Coord2AddressResult[], status: string) => void
    ): void
  }

  interface AddressSearchResult {
    address_name: string
    address: {
      address_name: string
      region_1depth_name: string
      region_2depth_name: string
      region_3depth_name: string
      mountain_yn: string
      main_address_no: string
      sub_address_no: string
    }
    road_address: {
      address_name: string
      region_1depth_name: string
      region_2depth_name: string
      region_3depth_name: string
      road_name: string
      underground_yn: string
      main_building_no: string
      sub_building_no: string
      building_name: string
      zone_no: string
    } | null
    x: string
    y: string
  }

  interface Coord2AddressResult {
    address: {
      address_name: string
      region_1depth_name: string
      region_2depth_name: string
      region_3depth_name: string
      mountain_yn: string
      main_address_no: string
      sub_address_no: string
    }
    road_address: {
      address_name: string
      region_1depth_name: string
      region_2depth_name: string
      region_3depth_name: string
      road_name: string
      underground_yn: string
      main_building_no: string
      sub_building_no: string
      building_name: string
      zone_no: string
    } | null
  }
}

export {}

