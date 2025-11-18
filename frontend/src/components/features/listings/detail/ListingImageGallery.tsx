'use client'

import { Card, CardContent } from '@mui/material'
import Image from 'next/image'
import * as React from 'react'

import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel'

interface ImageObject {
  url: string
  order?: number
  s3key?: string
}

interface ListingImageGalleryProps {
  images: (string | ImageObject)[]
}

/**
 * 매물 이미지 갤러리 (Carousel + Slide Indicator)
 */
export default function ListingImageGallery({ images }: ListingImageGalleryProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  /**
   * - object[] → url만 추출 + order 기반 정렬
   */
  const parsedImages: string[] = React.useMemo(() => {
    if (!images || images.length === 0) return []

    // string[] 케이스
    if (typeof images[0] === 'string') {
      return images as string[]
    }

    // object[] 케이스 (정렬 후 URL만 추출)
    return (images as ImageObject[])
      .filter(img => img && img.url) // null이나 url이 없는 항목 필터링
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map(img => img.url)
  }, [images])

  React.useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  if (!parsedImages || parsedImages.length === 0) {
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
          {parsedImages.map((image, index) => (
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
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="text-muted-foreground py-2 text-center text-xs">
        {current} / {count}
      </div>
    </div>
  )
}
