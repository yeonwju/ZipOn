interface ListingDescriptionProps {
  description: string
}

/**
 * 매물 상세 설명 컴포넌트
 *
 * 매물에 대한 자세한 설명을 표시합니다.
 */
export default function ListingDescription({ description }: ListingDescriptionProps) {
  if (!description) {
    return null
  }

  return (
    <section className="mt-2 bg-white px-4 py-6">
      <h2 className="mb-4 text-lg font-bold text-gray-900">상세 설명</h2>
      <p className="whitespace-pre-wrap text-base leading-relaxed text-gray-700">
        {description}
      </p>
    </section>
  )
}

