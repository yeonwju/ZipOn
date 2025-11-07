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
    <section className="mt-2 bg-white px-4">
      <div className="flex flex-wrap gap-2">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-2 rounded-lg border border-gray-50 bg-gray-200 px-2 py-0.5"
          >
            <span className="text-xs font-medium text-gray-500">{feature}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
