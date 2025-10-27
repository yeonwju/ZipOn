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

export default function KakaoMapLoader({ lat = 37.56, lng = 126.978, level = 3 }: KakaoMapProps) {
  const mapRef = useRef<kakao.maps.Map | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [isReady, setIsReady] = useState(false)

  /**  지도 초기화 */
  const initMap = () => {
    if (typeof window === 'undefined' || !window.kakao?.maps || mapRef.current) return

    const container = document.getElementById('map')
    if (!container) return

    const center = new window.kakao.maps.LatLng(lat, lng)
    mapRef.current = new window.kakao.maps.Map(container, {
      center,
      level,
      draggable: true,
      scrollwheel: true,
    })
    setIsReady(true)
  }

  /** Kakao SDK 감지 및 로드 */
  useEffect(() => {
    if (typeof window !== 'undefined' && window.kakao?.maps) {
      queueMicrotask(() => setScriptLoaded(true))
    }
  }, [])

  /**  SDK 로드 후 지도 초기화 */
  useEffect(() => {
    if (!scriptLoaded) return
    if (typeof window === 'undefined' || !window.kakao?.maps) return

    window.kakao.maps.load(initMap)

    return () => {
      // cleanup: 메모리 누수 방지
      mapRef.current = null
    }
  }, [scriptLoaded, lat, lng, level, initMap])

  return (
    <>
      {/*  SDK가 없을 때만 Script 로드 */}
      {!window.kakao?.maps && (
        <Script
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`}
          strategy="afterInteractive"
          onLoad={() => setScriptLoaded(true)}
          onError={e => console.error(' 카카오 맵 SDK 로드 실패:', e)}
        />
      )}

      {/*  지도 container */}
      <div
        id="map"
        className="h-[calc(100vh-60px)] w-full rounded-lg border border-gray-200 shadow-sm"
      >
        {!isReady && (
          <div className="flex h-full w-full items-center justify-center text-gray-500">
            지도 불러오는 중...
          </div>
        )}
      </div>
    </>
  )
}
