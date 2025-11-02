'use client'

import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'

import MiniMap from '@/components/common/map/MiniMap'
import { formatDistance } from '@/utils/distance'

interface LiveMapPreviewProps {
  /** 현재 위치 좌표 */
  currentLocation: { lat: number; lng: number } | null
  /** 검색한 주소 좌표 */
  addressCoords: { lat: number; lng: number } | null
  /** 두 위치 간 거리 (미터) */
  distance: number | null
  /** 위치 새로고침 함수 */
  onRefreshLocation: () => void
  /** 새로고침 중 여부 */
  isRefreshing: boolean
}

/**
 * 라이브 방송 지도 미리보기 컴포넌트
 *
 * 현재 위치와 매물 위치를 지도에 표시하고,
 * 거리 정보를 보여줍니다.
 */
export default function LiveMapPreview({
  currentLocation,
  addressCoords,
  distance,
  onRefreshLocation,
  isRefreshing,
}: LiveMapPreviewProps) {
  // 표시할 마커 목록 생성
  const markers = []

  // 현재 위치 마커 (파란색)
  if (currentLocation) {
    markers.push({
      position: currentLocation,
      title: '현재 위치',
      color: 'blue' as const,
    })
  }

  // 검색한 주소 위치 마커 (빨간색)
  if (addressCoords) {
    markers.push({
      position: addressCoords,
      title: '검색한 위치',
      color: 'red' as const,
    })
  }

  // 지도 중심 좌표 결정
  const mapCenter = addressCoords || currentLocation || { lat: 37.5665, lng: 126.978 }

  // 거리 조건
  const isDistanceCalculated = distance !== null
  const isWithinDistance = distance !== null && distance <= 100

  return (
    <div className="bg-white p-6">
      {/* 헤더 (범례 + 새로고침) */}
      <div className="mb-4 flex items-center justify-between">
        {/* 범례 */}
        <div className="flex gap-4 text-sm">
          {currentLocation && (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-600">현재 위치</span>
            </div>
          )}
          {addressCoords && (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="text-gray-600">매물 위치</span>
            </div>
          )}
        </div>

        {/* 위치 새로고침 버튼 */}
        <button
          onClick={onRefreshLocation}
          disabled={isRefreshing}
          className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
          title="현재 위치 새로고침"
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          <span>{isRefreshing ? '새로고침 중...' : '위치 새로고침'}</span>
        </button>
      </div>

      {/* 지도 */}
      <div className="relative">
        <MiniMap center={mapCenter} height={300} markers={markers} />

        {/* 새로고침 중 오버레이 */}
        {isRefreshing && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/80">
            <div className="flex flex-col items-center gap-2">
              <RefreshCw size={32} className="animate-spin text-blue-500" />
              <p className="text-sm font-medium text-gray-700">위치 갱신 중...</p>
            </div>
          </div>
        )}
      </div>

      {/* 거리 정보 */}
      {isDistanceCalculated && (
        <div className="mt-4">
          {isWithinDistance ? (
            <div className="flex items-center gap-2 rounded-md bg-green-50 px-4 py-3">
              <CheckCircle size={20} className="text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900">거리 조건 충족</p>
                <p className="text-xs text-green-700">
                  현재 위치에서 {formatDistance(distance!)} 떨어져 있습니다.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-md bg-amber-50 px-4 py-3">
              <AlertCircle size={20} className="text-amber-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-900">거리가 너무 멉니다</p>
                <p className="text-xs text-amber-700">
                  매물에서 100m 이내에 있어야 라이브 방송을 시작할 수 있습니다. (현재:{' '}
                  {formatDistance(distance!)})
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 안내 메시지 */}
      {!addressCoords && !currentLocation && (
        <p className="mt-4 text-center text-xs text-gray-500">
          주소를 검색하거나 위치 권한을 허용하면 지도에 표시됩니다.
        </p>
      )}
    </div>
  )
}
