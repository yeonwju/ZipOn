import { Check } from 'lucide-react'

interface ListingFeaturesProps {
  features: string[]
}

/**
 * 매물 특징/옵션 컴포넌트
 *
 * 매물의 특징과 제공되는 옵션들을 표시합니다.
 * (예: 주차 가능, 엘리베이터, 반려동물 가능 등)
 */
export default function ListingFeatures({ features }: ListingFeaturesProps) {
  if (!features || features.length === 0) {
    return null
  }

  return (
    <section className="mt-2 bg-white px-4 py-6">
      <h2 className="mb-4 text-lg font-bold text-gray-900">특징 및 옵션</h2>
      <div className="grid grid-cols-2 gap-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
          >
            <Check className="h-5 w-5 flex-shrink-0 text-green-600" />
            <span className="text-sm font-medium text-gray-900">{feature}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

