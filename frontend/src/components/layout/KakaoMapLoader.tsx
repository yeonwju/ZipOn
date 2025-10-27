'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

import { kakao } from '@/types/kakao.maps'

declare global {
  interface Window {
    kakao: typeof kakao
  }
}

interface KakaoMapProps {
  lat?: number
  lng?: number
  level?: number
}

export default function KakaoMapLoader({ lat = 37.5665, lng = 126.978, level = 3 }: KakaoMapProps) {
  const mapRef = useRef<kakao.maps.Map | null>(null)
  const markersRef = useRef<kakao.maps.Marker[]>([])
  const [isReady, setIsReady] = useState(false)

  /** 지도 초기화 */
  const initMap = () => {
    if (!window.kakao?.maps) return
    const container = document.getElementById('map')
    if (!container) return

    const center = new window.kakao.maps.LatLng(lat, lng)
    const map = new window.kakao.maps.Map(container, { center, level })
    mapRef.current = map

    const marker = new window.kakao.maps.Marker({ map, position: center })
    markersRef.current = [marker]

    window.kakao.maps.event.addListener(map, 'click', e => {
      const latlng = e.latLng
      const marker = new window.kakao.maps.Marker({ map, position: latlng })
      markersRef.current.push(marker)
      console.log('📍 클릭 위치:', latlng.getLat(), latlng.getLng())
    })
  }

  /** 지도 로드 트리거 */
  useEffect(() => {
    if (isReady) {
      window.kakao.maps.load(initMap)
      return
    }

    if (window.kakao?.maps) {
      window.kakao.maps.load(initMap)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsReady(true)
    }
  }, [isReady, lat, lng, level])

  return (
    <>
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`}
        strategy="afterInteractive"
        onLoad={() => {
          setIsReady(true)
        }}
        onError={e => console.error('❌ 카카오 맵 로드 실패:', e)}
      />
      <div id="map" className="h-screen w-full" />
    </>
  )
}
