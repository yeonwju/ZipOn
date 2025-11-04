'use client'

import { useEffect, useRef } from 'react'

import { createAddressLocationMarkerElement } from '@/components/map/AddressLocationMarker'
import { createUserLocationMarkerElement } from '@/components/map/UserLocationMarker'
import useKakaoLoader from '@/hooks/map/useKakaoLoader'

interface MiniMapProps {
  /** 지도 중심 좌표 */
  center?: { lat: number; lng: number }
  /** 지도 높이 (픽셀) */
  height?: number
  /** 마커 표시 여부 */
  markers?: Array<{
    position: { lat: number; lng: number }
    title?: string
    color?: 'red' | 'blue'
  }>
}

/**
 * 미니맵 컴포넌트
 *
 * 작은 크기로 지도를 미리보기로 보여주는 컴포넌트입니다.
 * 라이브 방송 생성 등에서 위치를 간단히 확인할 때 사용합니다.
 */
export default function MiniMap({ center, height = 300, markers = [] }: MiniMapProps) {
  useKakaoLoader()

  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<KakaoMap | null>(null)
  const overlaysRef = useRef<KakaoCustomOverlay[]>([])

  // 지도 초기화
  useEffect(() => {
    if (!mapContainerRef.current) return

    let attempts = 0
    const maxAttempts = 50 // 50 * 100ms = 5초

    // 카카오맵 API 로드 대기
    const initMap = () => {
      attempts++

      if (!window.kakao?.maps) {
        if (attempts < maxAttempts) {
          setTimeout(initMap, 100) // 100ms 후 재시도
        } else {
          console.error('카카오맵 API 로드 실패: 시간 초과')
        }
        return
      }

      const defaultCenter = center || { lat: 37.5665, lng: 126.978 } // 서울시청

      const mapOption = {
        center: new window.kakao.maps.LatLng(defaultCenter.lat, defaultCenter.lng),
        level: 3,
      }

      mapRef.current = new window.kakao.maps.Map(mapContainerRef.current!, mapOption)
    }

    initMap()

    return () => {
      mapRef.current = null
    }
  }, [])

  // 중심 좌표 변경 시 지도 이동
  useEffect(() => {
    if (!mapRef.current || !center) return

    const newCenter = new window.kakao.maps.LatLng(center.lat, center.lng)
    mapRef.current.setCenter(newCenter)
  }, [center])

  // 마커 표시
  useEffect(() => {
    if (!mapRef.current || !window.kakao?.maps) return

    // 기존 마커/오버레이 제거
    overlaysRef.current.forEach(overlay => {
      overlay.setMap(null)
    })
    overlaysRef.current = []

    // 새 마커 추가
    markers.forEach(markerData => {
      const position = new window.kakao.maps.LatLng(
        markerData.position.lat,
        markerData.position.lng
      )

      if (markerData.color === 'blue') {
        // 파란색 파동 마커 (현재 위치용) - 기존 프로젝트 스타일 사용
        const markerElement = createUserLocationMarkerElement()

        const overlay = new window.kakao.maps.CustomOverlay({
          position,
          content: markerElement,
          xAnchor: 0.5,
          yAnchor: 0.5,
        })

        overlay.setMap(mapRef.current)
        overlaysRef.current.push(overlay)
      } else {
        // 빨간색 파동 마커 (검색한 위치용) - 파란색 마커와 동일한 스타일
        const markerElement = createAddressLocationMarkerElement()

        const overlay = new window.kakao.maps.CustomOverlay({
          position,
          content: markerElement,
          xAnchor: 0.5,
          yAnchor: 0.5,
        })

        overlay.setMap(mapRef.current)
        overlaysRef.current.push(overlay)
      }
    })

    // 모든 마커가 보이도록 범위 조정
    if (markers.length > 1) {
      const bounds = new window.kakao.maps.LatLngBounds()
      markers.forEach(markerData => {
        bounds.extend(
          new window.kakao.maps.LatLng(markerData.position.lat, markerData.position.lng)
        )
      })
      mapRef.current.setBounds(bounds)
    }
  }, [markers])

  return (
    <div
      ref={mapContainerRef}
      style={{ width: '100%', height: `${height}px` }}
      className="overflow-hidden rounded-lg border border-gray-300 shadow-sm"
    />
  )
}
