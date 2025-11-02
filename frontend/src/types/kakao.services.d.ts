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
        LatLng: new (lat: number, lng: number) => any
        Map: new (container: HTMLElement, options: any) => any
        Marker: new (options: any) => any
        CustomOverlay: new (options: any) => any
        LatLngBounds: new () => any
        Size: new (width: number, height: number) => any
        MarkerImage: new (src: string, size: any, options?: any) => any
      }
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

