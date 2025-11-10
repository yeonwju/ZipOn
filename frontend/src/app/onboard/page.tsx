'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function OnboardContent() {
  const searchParams = useSearchParams()

  // 리다이렉트 파라미터 가져오기 (null이면 기본값)
  const redirectPath = searchParams.get('redirect') || '/home'

  // URL 수동 조합 (인코딩 처리)
  const loginUrl = new URL(
    `http://localhost:8080/api/v1/login/google?redirect_url=${encodeURIComponent(redirectPath)}`
  )

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-bold">환영합니다! 👋</h1>
          <p className="mt-2 text-gray-600">시작하려면 로그인해주세요</p>
        </div>

        <Link
          href={loginUrl.toString()}
          className="w-full rounded-lg bg-blue-500 px-4 py-3 text-white hover:bg-blue-600"
        >
          Google로 시작하기
        </Link>
      </div>
    </div>
  )
}

export default function OnboardPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <OnboardContent />
    </Suspense>
  )
}
