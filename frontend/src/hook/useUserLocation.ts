'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * 사용자 위치 정보 타입 정의
 * @property lat - 위도 (latitude)
 * @property lng - 경도 (longitude)
 * @property accuracy - 위치 정확도 (미터 단위, 선택사항)
 */
interface Location {
  lat: number
  lng: number
  accuracy?: number
}

/**
 * 사용자의 GPS 위치를 실시간으로 추적하는 훅
 *
 * 이 훅은 브라우저의 Geolocation API를 사용하여 사용자의 현재 위치를 가져옵니다.
 * 위치 정확도를 모니터링하고, 정확도가 낮으면 자동으로 재시도합니다.
 *
 * **주요 기능:**
 * - GPS를 통한 실시간 위치 추적 (watchPosition 사용)
 * - 고정밀 위치 측정 (enableHighAccuracy: true)
 * - 정확도 기반 자동 재시도 (50m 이하 목표)
 * - 에러 발생 시 자동 재시도
 * - 컴포넌트 언마운트 시 자동 정리
 *
 * **정확도 관리:**
 * - 위치 정확도가 50m를 초과하면 3초 후 재시도
 * - 더 정확한 위치가 감지되면 자동 업데이트
 * - 정확도 정보를 함께 반환하여 UI에서 활용 가능
 *
 * **에러 처리:**
 * - 권한 거부, 위치 불가, 타임아웃 등 다양한 에러 처리
 * - 에러 발생 시에도 3초 후 자동 재시도
 * - 에러 메시지를 반환하여 사용자에게 안내 가능
 *
 * **퍼미션 요구사항:**
 * - 사용자의 위치 정보 접근 권한 필요
 * - 브라우저에서 위치 접근 권한 요청 팝업 표시
 * - HTTPS 환경에서만 정상 작동 (localhost 제외)
 *
 * @returns {Object} 위치 정보와 에러
 * @returns {Location | null} location - 현재 위치 좌표 (lat, lng, accuracy)
 * @returns {string | null} error - 에러 메시지 (에러가 없으면 null)
 *
 * @example
 * ```tsx
 * // 기본 사용법 - 현재 위치 가져오기
 * function MapPage() {
 *   const { location, error } = useUserLocation()
 *
 *   if (error) {
 *     return <div>에러: {error}</div>
 *   }
 *
 *   if (!location) {
 *     return <div>위치 정보를 가져오는 중...</div>
 *   }
 *
 *   return (
 *     <Map center={location} level={3}>
 *       <Marker position={location} />
 *     </Map>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // 정확도 정보 표시
 * const { location, error } = useUserLocation()
 *
 * return (
 *   <div>
 *     {location && (
 *       <p>
 *         위치: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
 *         {location.accuracy && ` (정확도: ±${location.accuracy.toFixed(0)}m)`}
 *       </p>
 *     )}
 *     {error && <p className="text-red-500">{error}</p>}
 *   </div>
 * )
 * ```
 *
 * @example
 * ```tsx
 * // useMapMarker와 함께 사용
 * const [map, setMap] = useState(null)
 * const { location } = useUserLocation()
 *
 * // 현재 위치에 마커 표시
 * useUserMarker(map, location)
 *
 * return (
 *   <Map
 *     onCreate={setMap}
 *     center={location || defaultCenter}
 *   />
 * )
 * ```
 *
 * @example
 * ```tsx
 * // 위치 기반 검색
 * const { location } = useUserLocation()
 *
 * useEffect(() => {
 *   if (location) {
 *     // 내 위치 주변 매물 검색
 *     searchNearbyListings(location.lat, location.lng, 1000) // 1km 반경
 *   }
 * }, [location])
 * ```
 */
export default function useUserLocation() {
  const [location, setLocation] = useState<Location | null>(null)
  const [error, setError] = useState<string | null>(null)
  const bestAccuracyRef = useRef<number>(Infinity)
  const ACCURACY_THRESHOLD = 50 // m
  const RETRY_DELAY = 3000 // 재시도 주기 (3초)

  useEffect(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      const errorMsg = '이 환경에서는 위치 정보가 지원되지 않습니다.'
      setTimeout(() => setError(errorMsg), 0)
      return
    }

    let watcherId: number
    let retryTimeout: NodeJS.Timeout

    const requestLocation = () => {
      // 이전 watcher가 있으면 제거
      if (watcherId) navigator.geolocation.clearWatch(watcherId)

      watcherId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      })
    }

    const handleSuccess = (pos: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = pos.coords
      const improved = accuracy < bestAccuracyRef.current

      // 정확도 개선 시 업데이트
      if (improved) {
        bestAccuracyRef.current = accuracy
        setLocation({ lat: latitude, lng: longitude, accuracy })
      }

      // 정확도 기준 초과 시 → 일정 시간 후 재요청
      if (accuracy > ACCURACY_THRESHOLD) {
        console.warn(`위치 정확도가 낮습니다 (${accuracy.toFixed(1)}m). 재시도 중...`)
        clearTimeout(retryTimeout)
        retryTimeout = setTimeout(() => {
          requestLocation()
        }, RETRY_DELAY)
      }
    }

    const handleError = (err: GeolocationPositionError) => {
      let errorMsg: string
      switch (err.code) {
        case err.PERMISSION_DENIED:
          errorMsg = '위치 접근 권한이 거부되었습니다.'
          break
        case err.POSITION_UNAVAILABLE:
          errorMsg = '위치 정보를 사용할 수 없습니다.'
          break
        case err.TIMEOUT:
          errorMsg = '위치 요청 시간이 초과되었습니다.'
          break
        default:
          errorMsg = err.message
          break
      }
      setError(errorMsg)

      // 에러 발생 시에도 일정 시간 후 재시도
      clearTimeout(retryTimeout)
      retryTimeout = setTimeout(() => {
        requestLocation()
      }, RETRY_DELAY)
    }

    // 초기 요청
    requestLocation()

    return () => {
      navigator.geolocation.clearWatch(watcherId)
      clearTimeout(retryTimeout)
    }
  }, [])

  return { location, error }
}
