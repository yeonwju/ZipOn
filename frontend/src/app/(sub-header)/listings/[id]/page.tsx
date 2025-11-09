import { notFound } from 'next/navigation'

import { ListingDetail } from '@/components/features/listings'
import { getListingDetail } from '@/services/listingService'

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
  const seq = Number(id)

  // 유효하지 않은 ID인 경우
  if (isNaN(seq) || seq < 1 || seq > 100) {
    notFound()
  }

  // 매물 상세 정보 가져오기
  const listing = await getListingDetail(seq)

  // 매물이 없는 경우
  if (!listing) {
    notFound()
  }

  return <ListingDetail listing={listing} />
}
