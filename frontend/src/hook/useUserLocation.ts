'use client'

import { useEffect, useRef, useState } from 'react'

interface Location {
  lat: number
  lng: number
  accuracy?: number
}

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
