'use client'

import { useRouter } from 'next/navigation'

export default function ContractCompleteClient() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 py-8">
      {/* 메인 컨테이너 */}
      <div className="relative w-full max-w-md">
        {/* 축하 애니메이션 효과를 위한 배경 */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-1/4 h-32 w-32 rounded-full bg-yellow-200/30 blur-2xl" />
          <div className="absolute right-1/4 bottom-1/4 h-40 w-40 rounded-full bg-pink-200/30 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-200/30 blur-xl" />
        </div>

        {/* 카드 */}
        <div className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-sm shadow-2xl">
          {/* 상단 장식 */}
          <div className="relative h-48 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
            {/* 반짝이는 효과 */}
            <div className="absolute inset-0">
              <div className="absolute left-1/4 top-1/4 h-2 w-2 animate-pulse rounded-full bg-yellow-300" />
              <div className="absolute right-1/3 top-1/3 h-1.5 w-1.5 animate-pulse rounded-full bg-white delay-300" />
              <div className="absolute bottom-1/4 left-1/3 h-2.5 w-2.5 animate-pulse rounded-full bg-yellow-200 delay-700" />
              <div className="absolute right-1/4 bottom-1/3 h-1 w-1 animate-pulse rounded-full bg-white delay-1000" />
            </div>

            {/* 이모지와 텍스트 */}
            <div className="flex h-full flex-col items-center justify-center">
              <div className="mb-4 text-7xl animate-bounce">🎉</div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">축하합니다!</h1>
            </div>
          </div>

          {/* 본문 내용 */}
          <div className="px-6 py-8">
            {/* 메인 메시지 */}
            <div className="mb-6 text-center">
              <h2 className="mb-3 text-2xl font-bold text-gray-800">계약이 완료되었습니다</h2>
              <p className="text-base leading-relaxed text-gray-600">
                안전하고 신뢰할 수 있는 계약이 성사되었습니다.
                <br />
                새로운 시작을 응원합니다!
              </p>
            </div>

            {/* 아이콘 그리드 */}
            <div className="mb-8 flex justify-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
                  ✨
                </div>
                <span className="text-xs font-medium text-gray-600">안전한 거래</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-3xl">
                  🏠
                </div>
                <span className="text-xs font-medium text-gray-600">새로운 집</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-3xl">
                  💝
                </div>
                <span className="text-xs font-medium text-gray-600">행복한 생활</span>
              </div>
            </div>

            {/* 축하 메시지 박스 */}
            <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-5 text-center">
              <p className="text-sm font-medium text-gray-700">
                계약서가 성공적으로 체결되었습니다.
                <br />
                앞으로도 안전하고 편리한 서비스를 제공하겠습니다.
              </p>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-5">
            <button
              onClick={() => router.push('/home')}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 py-4 text-base font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
            >
              홈으로 가기
            </button>
          </div>
        </div>

        {/* 하단 장식 요소 */}
        <div className="mt-8 flex justify-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-300" />
          <div className="h-1.5 w-1.5 rounded-full bg-purple-300" />
          <div className="h-1.5 w-1.5 rounded-full bg-pink-300" />
        </div>
      </div>
    </div>
  )
}

