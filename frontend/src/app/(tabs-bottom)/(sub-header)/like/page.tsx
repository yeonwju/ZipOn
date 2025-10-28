import type { Metadata } from 'next'

import ListingItem from '@/components/item/ListingItem'

export const metadata: Metadata = {
  title: 'HomeOn - 찜한 매물',
  description: '내가 찜한 매물 목록을 확인하세요',
}

/**
 * 찜한 매물 페이지 (Server Component)
 * 
 * 사용자가 찜한 매물 목록을 표시합니다.
 * 향후 API 연결 시 서버에서 데이터를 가져와 표시합니다.
 */
export default function LikePage() {
  return (
    <section>
      <div className={'flex flex-col gap-4'}>
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
