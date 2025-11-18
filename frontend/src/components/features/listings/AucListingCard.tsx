import Image from 'next/image'
import Link from 'next/link'

import { ListingData } from '@/types/api/listings'

interface AucListingCardProps {
  listing: ListingData
  className?: string
}

function formatKoreanMoney(value: number): string {
  if (value >= 100000000) {
    const eok = value / 100000000
    return `${eok.toFixed(eok % 1 === 0 ? 0 : 1)}억`
  }
  const man = value / 10000
  return `${man.toLocaleString()}만`
}

export default function AucListingCard({ listing, className }: AucListingCardProps) {
  return (
    <Link href={`/listings/${listing.propertySeq}`}>
      <div className="flex h-[130px] w-full border-b border-gray-200 bg-white">
        {/* Left Image */}
        <div className="relative h-full w-[150px] flex-shrink-0">
          <Image src="/listing.svg" alt="매물 이미지" fill className="object-cover" />
        </div>

        {/* Right */}
        <div className="mt-1 flex flex-1 flex-col overflow-hidden px-4 py-1">
          {/* Title + Lessor (한 줄로 압축) */}
          <div className="flex flex-col leading-tight">
            <h3 className="truncate text-sm font-semibold text-gray-900">{listing.title}</h3>
            <span className="text-[11px] text-gray-500">{listing.lessorNm}</span>
          </div>

          {/* 가격 리스트 */}
          <div className="mt-1.5 flex flex-col gap-[1px] text-sm leading-tight font-medium text-gray-900">
            <div className="flex justify-between">
              <span className="text-gray-700">보증금</span>
              <span>{formatKoreanMoney(listing.deposit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">월세</span>
              <span>{formatKoreanMoney(listing.mnRent)}</span>
            </div>
            {listing.fee > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-700">관리비</span>
                <span>{formatKoreanMoney(listing.fee)}</span>
              </div>
            )}
          </div>

          {/* 면적 */}
          <span className="mt-auto text-[11px] text-gray-500">
            {listing.area}m² / {listing.areaP}평
          </span>
        </div>
      </div>
    </Link>
  )
}
