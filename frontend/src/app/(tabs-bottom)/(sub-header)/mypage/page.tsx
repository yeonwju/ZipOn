import { Profile } from '@/components/features'
import ListingTaps from '@/components/features/mypage/ListingTaps'

/**
 * 마이페이지 (Server Component)
 *
 * 사용자의 프로필, 활동 내역, 설정 등을 표시합니다.
 * 향후 API 연결 시 서버에서 사용자 데이터를 가져와 표시합니다.
 */

// 아래값은 임의 데이터 입니다.
export default function MyPage() {
  return (
    <section className="flex w-full flex-col p-4">
      <section className={'p-2'}>
        <Profile />
      </section>
      <ListingTaps className={'mt-4'} />
    </section>
  )
}
