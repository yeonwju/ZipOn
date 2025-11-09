import { ListingDetail } from '@/components/features/listings'

export const dynamic = 'force-dynamic'

interface ListingPageProps {
  params: Promise<{ id: string }>
}

/**
 * 매물 상세 페이지 (Server Component)
 *
 * 동적 라우트로 매물 ID를 받아 상세 정보를 표시합니다.
 * 향후 API 연결 시 서버에서 데이터를 페칭하여 표시합니다.
 *
 * @param params - URL 파라미터 (id)
 */
export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params

  // TODO: API에서 매물 데이터 가져오기
  // const listing = await fetchListingById(id)
  // if (!listing) notFound()

  // 임시 데이터
  const listing = {
    id,
    name: `매물 ${id}`,
    address: '서울특별시 강남구 테헤란로 123',
    deposit: 5000,
    rent: 50,
    type: '원룸',
    area: 33,
    floor: 5,
    totalFloor: 12,
    description:
      '깔끔하고 넓은 원룸입니다. 역세권이며 주변 편의시설이 많습니다. 채광이 좋고 관리가 잘 되어 있습니다.',
    images: ['/listing.svg', '/listing.svg', '/listing.svg', '/listing.svg'],
    features: ['주차 가능', '엘리베이터', '반려동물 가능', '풀옵션'],
    availableDate: '2024-12-01',
  }

  return <ListingDetail listing={listing} />
}
