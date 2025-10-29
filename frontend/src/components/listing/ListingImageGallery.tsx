'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ListingImageGalleryProps {
  images: string[]
}

/**
 * 매물 이미지 갤러리 컴포넌트
 *
 * 매물의 이미지를 스와이프 가능한 갤러리로 표시합니다.
 * 현재 이미지 인덱스를 하단에 표시합니다.
 *
 * @param images - 이미지 URL 배열
 */
export default function ListingImageGallery({ images }: ListingImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center bg-gray-200">
        <p className="text-gray-500">이미지가 없습니다</p>
      </div>
    )
  }

  return (
    <div className="relative bg-black">
      {/* 이미지 컨테이너 */}
      <div className="relative h-60 w-full snap-x snap-mandatory overflow-x-auto scroll-smooth">
        <div className="flex h-full">
          {images.map((image, index) => (
            <div key={index} className="relative h-full w-full flex-shrink-0 snap-center">
              <Image
                src={image}
                alt={`매물 이미지 ${index + 1}`}
                fill
                className="object-cover"
                onLoad={() => {
                  // 스크롤 이벤트 감지를 위한 추가 로직 (옵션)
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 이미지 인디케이터 */}
      <div className="absolute right-0 bottom-4 left-0 flex justify-center">
        <div className="rounded-full bg-black/50 px-3 py-1">
          <span className="text-sm font-medium text-white">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      </div>

      {/* 좌우 네비게이션 버튼 (옵션) */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg transition-opacity hover:bg-white disabled:opacity-50"
            disabled={currentIndex === 0}
            aria-label="이전 이미지"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentIndex(prev => Math.min(images.length - 1, prev + 1))}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg transition-opacity hover:bg-white disabled:opacity-50"
            disabled={currentIndex === images.length - 1}
            aria-label="다음 이미지"
          >
            →
          </button>
        </>
      )}

      {/* 하단 썸네일 도트 */}
      <div className="absolute right-0 bottom-12 left-0 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentIndex ? 'w-4 bg-white' : 'bg-white/50'
            }`}
            aria-label={`이미지 ${index + 1}로 이동`}
          />
        ))}
      </div>
    </div>
  )
}
