'use client'

import { Map } from 'react-kakao-maps-sdk'

import useKakaoLoader from '@/hook/useKakaoLoader'

export default function BasicMap() {
  useKakaoLoader()

  return (
    <div className="relative h-screen w-full">
      {/* 지도 */}
      <Map
        id="map"
        center={{ lat: 33.450701, lng: 126.570667 }}
        style={{ width: '100%', height: '100%' }}
        level={3}
        className="absolute inset-0 z-0"
      />

      <div className="pointer-events-none absolute inset-0">
        <button
          onClick={() => console.log('안녕 클릭')}
          className="pointer-events-auto absolute top-4 left-4 z-10 rounded-lg bg-white px-4 py-2 shadow"
        >
          안녕 👋
        </button>

        <button className="pointer-events-auto absolute right-6 bottom-6 z-10 rounded-full bg-blue-500 px-4 py-2 text-white shadow-lg">
          내 위치로 이동
        </button>
      </div>
    </div>
  )
}
