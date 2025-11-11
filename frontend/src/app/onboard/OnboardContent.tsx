'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

/**
 * Onboard Content (Client Component)
 *
 * useSearchParams Hook을 사용하기 위한 클라이언트 컴포넌트입니다.
 * 페이지는 Server Component로 유지하고 이 부분만 Client로 분리했습니다.
 */
export default function OnboardContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // 리다이렉트 파라미터 가져오기 (null이면 기본값)
  const redirectPath = searchParams.get('redirect') || '/home'
  const fromPath = searchParams.get('from') // 이전 페이지 정보

  // 뒤로가기로 돌아온 경우 처리
  useEffect(() => {
    const storedFromPath = sessionStorage.getItem('auth_from_path')
    
    // 세션 스토리지에 auth_from_path가 있고, URL에 from/redirect 파라미터가 없으면
    // 이는 로그인 후 mypage에서 뒤로가기로 돌아온 것임
    if (storedFromPath && !fromPath && !searchParams.get('redirect')) {
      // 플래그 제거 후 원래 페이지로 리다이렉트
      sessionStorage.removeItem('auth_from_path')
      router.replace(storedFromPath)
    }
  }, [fromPath, router, searchParams])

  // 이전 페이지 정보를 세션 스토리지에 저장 (로그인 후 히스토리 정리용)
  useEffect(() => {
    if (fromPath) {
      sessionStorage.setItem('auth_from_path', fromPath)
    }
  }, [fromPath])

  // URL 수동 조합 (인코딩 처리)
  const loginUrl = new URL(
    `https://dev-zipon.duckdns.org/api/v1/login/google?redirect_url=${encodeURIComponent(redirectPath)}`
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

