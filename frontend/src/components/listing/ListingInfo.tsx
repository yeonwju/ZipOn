import { Calendar, Home, Layers } from 'lucide-react'

interface ListingInfoProps {
  name: string
  deposit: number
  rent: number
  type: string
  area: number
  floor: number
  totalFloor: number
  availableDate: string
}

/**
 * 매물 기본 정보 컴포넌트
 *
 * 가격, 타입, 면적, 층수, 입주 가능일 등의 기본 정보를 표시합니다.
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
}: ListingInfoProps) {
  return (
    <section className="bg-white px-4 py-6">
      <div className={'text-2xl font-bold'}>{name}</div>
      {/* 가격 */}
      <div className="mb-6">
        <div className="mb-2 flex items-baseline gap-2">
          <span className="text-md font-bold text-gray-900">
            {deposit >= 10000 ? `${(deposit / 10000).toFixed(1)}억` : `${deposit}만원`}
          </span>
          {rent > 0 && <span className="text-md font-semibold text-blue-600">/ {rent}만원</span>}
        </div>
      </div>

      {/* 상세 정보 그리드 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 타입 */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
            <Home className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">타입</p>
            <p className="font-semibold text-gray-900">{type}</p>
          </div>
        </div>

        {/* 면적 */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
            <Layers className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">면적</p>
            <p className="font-semibold text-gray-900">{area}㎡</p>
          </div>
        </div>

        {/* 층수 */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
            <Layers className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">층수</p>
            <p className="font-semibold text-gray-900">
              {floor}층 / {totalFloor}층
            </p>
          </div>
        </div>

        {/* 입주 가능일 */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
            <Calendar className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">입주 가능일</p>
            <p className="font-semibold text-gray-900">{availableDate}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
