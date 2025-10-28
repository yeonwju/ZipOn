'use client'

import { useEffect, useRef, useState } from 'react'
import { Map, MapMarker } from 'react-kakao-maps-sdk'

import SearchBar from '@/components/layout/SearchBar'
import useKakaoLoader from '@/hook/useKakaoLoader'
import useUserLocation from '@/hook/useUserLocation'
import { kakao } from '@/types/kakao.maps'

export default function BasicMap() {
  useKakaoLoader()
  const { location } = useUserLocation()
  const [map, setMap] = useState<kakao.maps.Map | null>(null)
  const [center, setCenter] = useState({ lat: 33.450701, lng: 126.570667 })
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleCenterChanged = () => {
    if (!map) return
    const latlng = map.getCenter()
    setCenter({ lat: latlng.getLat(), lng: latlng.getLng() })
  }

  useEffect(() => {
    // 이전 타이머 취소
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // 1초 후에 콘솔 출력 (움직임이 멈췄을 때만 출력됨)
    timeoutRef.current = setTimeout(() => {
      console.log(' 현재 지도 중심:', center)
    }, 1000)

    // cleanup 함수로 타이머 정리
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [center])

  return (
    <div className="relative h-screen w-full">
      <Map
        id="map"
        center={location || center}
        style={{ width: '100%', height: '100%' }}
        level={3}
        className="absolute inset-0 z-0"
        onCreate={map => setMap(map)}
        onCenterChanged={handleCenterChanged}
      >
        <MapMarker position={location || center} />
      </Map>

      {/* 지도 위 UI */}
      <div className="pointer-events-none absolute inset-0">
        <div className="pointer-events-auto absolute top-1 left-1 z-10 w-full pr-2">
          <SearchBar />
        </div>
      </div>
    </div>
  )
}
