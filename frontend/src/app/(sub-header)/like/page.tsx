import { ListingItem } from '@/components/features/home'

/**
 * 찜한 매물 페이지 (Server Component)
 *
 * 사용자가 찜한 매물 목록을 표시합니다.
 * 향후 API 연결 시 서버에서 데이터를 가져와 표시합니다.
 */
export default function LikePage() {
  return (
    <section className="p-4">
      <div className="flex flex-col gap-4">
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
      </div>
    </section>
  )
}
