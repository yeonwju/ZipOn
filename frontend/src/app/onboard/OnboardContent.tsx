'use client'

import { Video } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { API_BASE_URL } from '@/constants'

/**
 * Onboard Content (Client Component)
 *
 * useSearchParams Hook을 사용하기 위한 클라이언트 컴포넌트입니다.
 * 페이지는 Server Component로 유지하고 이 부분만 Client로 분리했습니다.
 */
export default function OnboardContent() {
  const searchParams = useSearchParams()

  // 리다이렉트 파라미터 가져오기 (null이면 기본값)
  const redirectPath = searchParams.get('redirect') || '/home'
  const fromPath = searchParams.get('from') // 이전 페이지 정보

  // 이전 페이지 정보를 세션 스토리지에 저장 (로그인 후 뒤로가기 처리용)
  useEffect(() => {
    if (fromPath) {
      sessionStorage.setItem('auth_from_path', fromPath)
    }
  }, [fromPath])

  // URL 수동 조합 (인코딩 처리)
  const loginUrl = new URL(
    `${API_BASE_URL}/api/v1/login/google?redirect_url=${encodeURIComponent(redirectPath)}`
  )

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      {/* 배경 장식 요소 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute -right-32 -bottom-32 h-64 w-64 rounded-full bg-blue-300/30 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="space-y-8">
          {/* 헤더 */}
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
              <Video className="h-4 w-4" />
              <span>실시간 라이브 중개</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              ZipOn에 오신 것을
              <br />
              <span className="text-blue-600">환영합니다</span>
            </h1>
            <p className="text-gray-600">
              실시간 라이브 방송을 통해
              <br />더 쉽고 빠르게 부동산을 찾아보세요
            </p>
          </div>

          {/* 로그인 카드 */}
          <div className="space-y-6 rounded-2xl border border-blue-100 bg-white/80 p-8 shadow-lg backdrop-blur-sm">
            <div className="space-y-2 text-center">
              <h2 className="text-xl font-semibold text-gray-900">시작하기</h2>
              <p className="text-sm text-gray-600">로그인하여 ZipOn의 모든 기능을 이용해보세요</p>
            </div>

            <Link
              href={loginUrl.toString()}
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Google로 시작하기</span>
            </Link>

            <p className="text-center text-xs text-gray-500">
              로그인 시 이용약관 및 개인정보 처리방침에 동의하게 됩니다
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
