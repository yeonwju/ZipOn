import { ReactNode } from 'react'

interface ListingInfoItemProps {
  icon: ReactNode
  value: string | number
}

/**
 * 매물 정보 아이템 (아이콘 + 라벨 + 값)
 *
 * 예: 면적, 층수, 입주 가능일 등
 */
export default function ListingInfoItem({ icon, value }: ListingInfoItemProps) {
  return (
    <div className="flex items-center">
      <div className={`flex h-7 w-7 items-center justify-center`}>{icon}</div>
      <div>
        <p className="text-xs font-medium text-gray-900">{value}</p>
      </div>
    </div>
  )
}
