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
  const seq = Number(id)

  return <ListingDetail propertySeq={seq} />
}
