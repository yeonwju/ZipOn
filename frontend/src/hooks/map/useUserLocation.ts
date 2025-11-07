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
 * 브라우저 Geolocation API를 사용하여 현재 위치를 가져옵니다.
 * 정확도가 50m 이하가 될 때까지 자동 재시도합니다.
 * 
 * @returns location - 현재 위치 좌표 (lat, lng, accuracy)
 * @returns error - 에러 메시지
 * @returns refresh - 위치를 수동으로 다시 가져오는 함수
 * @returns isRefreshing - 새로고침 중 여부
 * 
 * @example
 * const { location, error, refresh, isRefreshing } = useUserLocation()
 * return <Map center={location || defaultCenter} />
 */
export default function useUserLocation() {
  const [location, setLocation] = useState<Location | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const bestAccuracyRef = useRef<number>(Infinity)
  const watcherIdRef = useRef<number | null>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const ACCURACY_THRESHOLD = 50 // m
  const RETRY_DELAY = 3000 // 재시도 주기 (3초)

  const handleSuccess = (pos: GeolocationPosition) => {
    const { latitude, longitude, accuracy } = pos.coords
    const improved = accuracy < bestAccuracyRef.current

    // 정확도 개선 시 업데이트
    if (improved) {
      bestAccuracyRef.current = accuracy
      setLocation({ lat: latitude, lng: longitude, accuracy })
      setIsRefreshing(false)
    }

    // 정확도 기준 초과 시 → 일정 시간 후 재요청
    if (accuracy > ACCURACY_THRESHOLD) {
      console.warn(`위치 정확도가 낮습니다 (${accuracy.toFixed(1)}m). 재시도 중...`)
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = setTimeout(() => {
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
    setIsRefreshing(false)

    // 에러 발생 시에도 일정 시간 후 재시도
    if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current)
    retryTimeoutRef.current = setTimeout(() => {
      requestLocation()
    }, RETRY_DELAY)
  }

  const requestLocation = () => {
    // 이전 watcher가 있으면 제거
    if (watcherIdRef.current !== null) {
      navigator.geolocation.clearWatch(watcherIdRef.current)
    }

    watcherIdRef.current = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    })
  }

  useEffect(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      const errorMsg = '이 환경에서는 위치 정보가 지원되지 않습니다.'
      setTimeout(() => setError(errorMsg), 0)
      return
    }

    // 초기 요청
    requestLocation()

    return () => {
      if (watcherIdRef.current !== null) {
        navigator.geolocation.clearWatch(watcherIdRef.current)
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [])

  /**
   * 위치를 수동으로 새로고침
   */
  const refresh = () => {
    setIsRefreshing(true)
    setError(null)
    bestAccuracyRef.current = Infinity
    requestLocation()
  }

  return { location, error, refresh, isRefreshing }
}
