import Image from 'next/image'

import { Badge } from '@/components/ui/badge'

export default function ListingItem() {
  return (
    <div className="w-[140px] flex-shrink-0 rounded-2xl bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md sm:w-[160px] md:w-[200px]">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl">
        <Image
          src="/listing.svg"
          alt="listing"
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
        />
      </div>

      <div className="mt-3 flex flex-col">
        <Badge variant="secondary" className="w-fit bg-gray-100 text-[11px] text-gray-600">
          투룸
        </Badge>

        <h3 className="mt-2 text-sm leading-snug font-semibold text-gray-900 sm:text-base">
          송파 신축 입주 시작~!!
        </h3>

        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
          <Image
            src="/profile.svg"
            alt="profile"
            width={20}
            height={20}
            className="rounded-full border border-gray-200"
          />
          <span className="font-medium text-gray-600">변가원</span>
        </div>
      </div>
    </div>
  )
}
