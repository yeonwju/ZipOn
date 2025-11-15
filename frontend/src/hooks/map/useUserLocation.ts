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
  const retryCountRef = useRef<number>(0)
  const accuracyRetryCountRef = useRef<number>(0) // 정확도 재시도 횟수
  const ACCURACY_THRESHOLD = 50 // m
  const RETRY_DELAY = 5000 // 재시도 주기 (5초로 증가)
  const MAX_RETRIES = 2 // 최대 재시도 횟수 (3회에서 2회로 감소)
  const MAX_ACCURACY_RETRIES = 2 // 정확도 기준 초과 시 최대 재시도 횟수

  const handleSuccess = (pos: GeolocationPosition) => {
    const { latitude, longitude, accuracy } = pos.coords
    const improved = accuracy < bestAccuracyRef.current

    // 정확도 개선 시 업데이트
    if (improved) {
      bestAccuracyRef.current = accuracy
      setLocation({ lat: latitude, lng: longitude, accuracy })
      setIsRefreshing(false)
      // 성공 시 정확도 재시도 카운터 리셋
      accuracyRetryCountRef.current = 0
    }

    // 정확도 기준 초과 시 → 제한적으로 재시도
    if (accuracy > ACCURACY_THRESHOLD) {
      if (accuracyRetryCountRef.current < MAX_ACCURACY_RETRIES) {
        accuracyRetryCountRef.current += 1
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `위치 정확도가 낮습니다 (${accuracy.toFixed(1)}m). 재시도 중... (${accuracyRetryCountRef.current}/${MAX_ACCURACY_RETRIES})`
          )
        }
        if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = setTimeout(() => {
          requestLocation()
        }, RETRY_DELAY)
      } else {
        // 최대 재시도 횟수 초과 - 현재 위치라도 사용
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `위치 정확도가 낮지만 최대 재시도 횟수에 도달했습니다. 현재 위치(${accuracy.toFixed(1)}m)를 사용합니다.`
          )
        }
        setLocation({ lat: latitude, lng: longitude, accuracy })
        setIsRefreshing(false)
        accuracyRetryCountRef.current = 0
      }
    }
  }

  const handleError = (err: GeolocationPositionError) => {
    let errorMsg: string
    switch (err.code) {
      case err.PERMISSION_DENIED:
        errorMsg = '위치 접근 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.'
        break
      case err.POSITION_UNAVAILABLE:
        errorMsg = '위치 정보를 사용할 수 없습니다. GPS가 켜져있는지 확인해주세요.'
        break
      case err.TIMEOUT:
        errorMsg = '위치 요청 시간이 초과되었습니다. 다시 시도 중...'
        break
      default:
        errorMsg = err.message || '위치 정보를 가져올 수 없습니다.'
        break
    }
    
    // 개발 환경에서만 상세 에러 로그
    if (process.env.NODE_ENV === 'development') {
      console.warn('위치 정보 에러:', {
        code: err.code,
        message: err.message,
        retryCount: retryCountRef.current,
      })
    }
    
    setError(errorMsg)
    setIsRefreshing(false)

    // TIMEOUT 또는 POSITION_UNAVAILABLE인 경우 제한적으로 재시도
    // POSITION_UNAVAILABLE은 일시적인 문제일 수 있음 (예: GPS 초기화 중)
    if (
      (err.code === err.TIMEOUT || err.code === err.POSITION_UNAVAILABLE) &&
      retryCountRef.current < MAX_RETRIES
    ) {
      retryCountRef.current += 1
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = setTimeout(() => {
        // 재시도 시 enableHighAccuracy를 false로 시도 (더 관대한 설정)
        requestLocationWithFallback(false)
      }, RETRY_DELAY)
    } else if (err.code === err.TIMEOUT || err.code === err.POSITION_UNAVAILABLE) {
      // 최대 재시도 횟수 초과
      setError(
        '위치 정보를 가져올 수 없습니다. GPS가 켜져있는지 확인하고, 페이지를 새로고침해주세요.'
      )
      retryCountRef.current = 0
    }
    // PERMISSION_DENIED는 재시도하지 않음
  }

  const requestLocationWithFallback = (useHighAccuracy: boolean = true) => {
    // 이전 watcher가 있으면 제거
    if (watcherIdRef.current !== null) {
      navigator.geolocation.clearWatch(watcherIdRef.current)
      watcherIdRef.current = null
    }

    const options = {
      enableHighAccuracy: useHighAccuracy,
      timeout: useHighAccuracy ? 10000 : 15000, // 정확도 낮출 때는 timeout 더 길게
      maximumAge: useHighAccuracy ? 0 : 60000, // 정확도 낮출 때는 캐시 허용
    }

    // 먼저 getCurrentPosition으로 빠르게 위치 가져오기 시도
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handleSuccess(pos)
        // 성공 후 watchPosition으로 지속 추적
        watcherIdRef.current = navigator.geolocation.watchPosition(handleSuccess, handleError, {
          enableHighAccuracy: useHighAccuracy,
          timeout: 15000,
          maximumAge: 30000, // 30초 캐시 허용 (성능 개선)
        })
      },
      (err) => {
        // getCurrentPosition 실패 시 watchPosition으로 시도
        watcherIdRef.current = navigator.geolocation.watchPosition(handleSuccess, handleError, {
          enableHighAccuracy: false, // 실패 시 정확도 낮춤
          timeout: 15000,
          maximumAge: 60000, // 1분 캐시 허용
        })
      },
      options
    )
  }

  const requestLocation = () => {
    requestLocationWithFallback(true)
  }

  useEffect(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      const errorMsg = '이 환경에서는 위치 정보가 지원되지 않습니다.'
      setTimeout(() => setError(errorMsg), 0)
      return
    }

    // 위치 권한 상태 확인 (가능한 경우)
    if ('permissions' in navigator) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((result) => {
          if (result.state === 'denied') {
            setError('위치 접근 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.')
            return
          }
          // 권한이 있거나 prompt 상태면 위치 요청
          if (result.state === 'granted' || result.state === 'prompt') {
            requestLocation()
          }
        })
        .catch(() => {
          // permissions API가 지원되지 않으면 바로 요청
          requestLocation()
        })
    } else {
      // permissions API가 없으면 바로 요청
      requestLocation()
    }

    return () => {
      if (watcherIdRef.current !== null) {
        navigator.geolocation.clearWatch(watcherIdRef.current)
        watcherIdRef.current = null
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = null
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
    retryCountRef.current = 0
    accuracyRetryCountRef.current = 0
    requestLocation()
  }

  return { location, error, refresh, isRefreshing }
}
