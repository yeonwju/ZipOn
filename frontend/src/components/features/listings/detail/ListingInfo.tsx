import { CalendarDays, Grid3x3, House, Layers, MapPin } from 'lucide-react'

import ListingDetailProfile from '@/components/features/listings/detail/ListingDetailProfile'

import ListingInfoItem from './ListingInfoItem'

interface ListingInfoProps {
  name: string
  deposit: number
  rent: number
  type: string
  area: number
  floor: string
  totalFloor: string
  availableDate: string
  address: string
}

/**
 * 매물 기본 정보 컴포넌트
 *
 * 가격, 타입, 면적, 층수, 입주 가능일 등의 기본 정보를 표시합니다.
 * TODO 특약사항 추가
 */
export default function ListingInfo({
  name,
  deposit,
  rent,
  type,
  area,
  floor,
  totalFloor,
  availableDate,
  address,
}: ListingInfoProps) {
  return (
    <section className="bg-white px-3">
      <div className="text-2xl font-bold">{name}</div>
      <div className={'my-2'}>
        <ListingDetailProfile imgSrc={'/profile.svg'} name={'김도현'} className={'font-medium'} />
      </div>

      {/* 가격 */}
      <div className="mb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-md font-bold text-gray-900">
            {deposit >= 10000 ? `보증금 ${(deposit / 10000).toFixed(1)}억` : `월세 ${deposit}만원`}
          </span>
          {rent > 0 && (
            <span className="text-md font-semibold text-blue-400">/ 월세 {rent}만원</span>
          )}
        </div>
      </div>

      {/* 상세 정보 */}
      <div className="flex flex-wrap gap-2">
        {/* 타입 */}
        <ListingInfoItem icon={<House className={'h-4 w-4'} />} value={type} />

        {/* 면적 */}
        <ListingInfoItem icon={<Grid3x3 className={'h-4 w-4'} />} value={`${area}㎡`} />

        {/* 층수 */}
        <ListingInfoItem
          icon={<Layers className={'h-4 w-4'} />}
          value={`${floor}/${totalFloor}층`}
        />

        {/* 입주 가능일 */}
        <ListingInfoItem icon={<CalendarDays className={'h-4 w-4'} />} value={availableDate} />

        {/*주소*/}
        <ListingInfoItem icon={<MapPin className={'h-4 w-4'} />} value={address} />
      </div>
    </section>
  )
}
