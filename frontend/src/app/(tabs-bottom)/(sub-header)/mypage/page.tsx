import {Profile} from "@/components/features";
import {useUserStore} from "@/store/user";

/**
 * 마이페이지 (Server Component)
 *
 * 사용자의 프로필, 활동 내역, 설정 등을 표시합니다.
 * 향후 API 연결 시 서버에서 사용자 데이터를 가져와 표시합니다.
 */

export default function MyPage() {
  const {user} = useUserStore.getState()

  return (
    <section className="p-4">
      <Profile user={user}/>
    </section>
  )
}
