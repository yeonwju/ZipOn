'use client'

import Image from 'next/image'
import * as React from 'react'

import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

interface ListingImageGalleryProps {
  images: string[]
}

/**
 * 매물 이미지 갤러리 (Carousel + Slide Indicator)
 *
 * - shadcn/ui Carousel 기반
 * - 현재 슬라이드 번호 표시 (Slide 1 of N)
 * - 반응형 카드형 이미지 레이아웃
 */
export default function ListingImageGallery({ images }: ListingImageGalleryProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) return

    // 전체 슬라이드 수
    setCount(api.scrollSnapList().length)
    // 현재 인덱스
    setCurrent(api.selectedScrollSnap() + 1)

    // 슬라이드 이동 시 이벤트
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  if (!images || images.length === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg bg-gray-200">
        <p className="text-gray-500">이미지가 없습니다</p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <Card>
                <CardContent className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={image}
                    alt={`매물 이미지 ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  <CarouselPrevious className={'z-10'} />
                  <CarouselNext className={'z-10'} />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* 슬라이드 인덱스 표시 */}
      <div className="text-muted-foreground py-2 text-center text-xs">
        {current} / {count}
      </div>
    </div>
  )
}
