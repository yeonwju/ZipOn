import { Suspense } from 'react'

import LiveCreateContent from '@/components/features/live/LiveCreateContent'
import { LiveCreateSkeleton } from '@/components/skeleton/live'
import useKakaoLoader from '@/hooks/map/useKakaoLoader'

/**
 * 라이브 방송 생성 페이지
 *
 * 방송 생성 시 매물 위치를 간단히 미리보기 형태로 보여줍니다.
 * - 카카오 주소 검색 API를 사용하여 주소를 좌표로 변환
 * - 현재 위치와 입력한 주소 위치를 함께 지도에 표시
 */
export default function LiveCreatePage() {
  // 카카오맵 API 로드
  useKakaoLoader()

  return (
    <Suspense fallback={<LiveCreateSkeleton />}>
      <LiveCreateContent />
    </Suspense>
  )
}
