import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/**
 * 인증이 필요한 경로 보호 미들웨어 (1차 방어)
 *
 * 동작 방식:
 * 1. 쿠키에서 토큰(AT) 확인
 * 2. 토큰 없으면 즉시 /onboard로 리다이렉트
 * 3. 토큰 있으면 페이지로 이동 (2차 방어는 AuthGuard/Server에서)
 *
 * 장점:
 * - 매우 빠름 (API 호출 없음)
 * - 불필요한 페이지 로드 방지
 * - 서버 리소스 절약
 *
 * 보호 정책:
 * - 모든 경로를 보호 (기본값)
 * - /onboard로 시작하는 경로만 제외 (로그인/회원가입)
 */
export function middleware(req: NextRequest) {
  const token = req.cookies.get('AT')?.value
  const pathname = req.nextUrl.pathname

  // Next.js 내부 경로 및 정적 파일 제외
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot|css|js|json|xml|txt)$/)
  ) {
    return NextResponse.next()
  }

  // 제외할 경로 목록 (인증이 필요 없는 경로)
  const publicPaths = [
    '/onboard', // 로그인/회원가입
  ]

  // 제외 경로인지 확인
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  // 제외 경로가 아니고 토큰이 없으면 로그인 페이지로 리다이렉트
  if (!isPublicPath && !token) {
    const loginUrl = new URL('/onboard', req.url)
    loginUrl.searchParams.set('redirect', pathname)

    // 이전 페이지 정보 저장 (뒤로가기 문제 해결용)
    const referer = req.headers.get('referer')
    if (referer) {
      try {
        const refererUrl = new URL(referer)
        // 같은 도메인이고, onboard가 아닌 경우만 저장
        if (
          refererUrl.origin === req.nextUrl.origin &&
          !refererUrl.pathname.startsWith('/onboard')
        ) {
          loginUrl.searchParams.set('from', refererUrl.pathname)
        }
      } catch {
        // URL 파싱 실패 시 무시
      }
    }

    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

/**
 * Middleware가 실행될 경로 패턴
 *
 * 모든 경로에 대해 실행하되, middleware 함수 내에서 제외 경로 처리
 * Next.js는 자동으로 _next, 정적 파일 등을 제외하므로
 * 모든 경로를 매칭하고 middleware 함수에서 /onboard만 제외 처리
 */
export const config = {
  matcher: [
    /*
     * 모든 경로를 매칭
     * - /: 루트 경로
     * - /:path*: 모든 하위 경로
     * - Next.js는 자동으로 _next, 정적 파일 등을 제외
     * - /onboard는 middleware 함수 내에서 제외 처리
     */
    '/',
    '/:path*',
  ],
}
