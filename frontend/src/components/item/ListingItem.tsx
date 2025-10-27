import { Ellipsis } from 'lucide-react'
import Image from 'next/image'

import { Badge } from '@/components/ui/badge'

export default function ListingItem() {
  return (
    <div className="flex max-h-[130px] w-full flex-row gap-4 px-4 py-2">
      <div className="relative aspect-square w-[200px] overflow-hidden rounded-xl">
        <Image
          src="/listing.svg"
          alt="listing"
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="flex w-full flex-col justify-between gap-2">
        <div className="flex w-full items-center justify-between">
          <Badge variant="secondary" className="bg-gray-100 text-[11px] text-gray-600">
            투룸
          </Badge>
          <Ellipsis width={20} height={20} />
        </div>

        <div className="w-[100px] truncate text-xl font-bold sm:w-[150px] md:w-[200px]">송파 1</div>

        <div className="flex items-center gap-2">
          <Image
            src="/profile.svg"
            alt="profile"
            width={22}
            height={22}
            className="rounded-full border border-gray-200"
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-600">변가원</span>
            <span className="text-xs text-gray-600">2m ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}
