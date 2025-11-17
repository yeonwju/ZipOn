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
 */
export function middleware(req: NextRequest) {
  const token = req.cookies.get('AT')?.value
  const pathname = req.nextUrl.pathname

  // 인증이 필요한 경로 목록
  const protectedPaths = [
    '/auction',      // 경매 결제 관련
    '/chat',         // 채팅 (전체)
    '/like',         // 찜한 매물
    '/listings/new', // 매물 등록
    '/live/create',  // 라이브 생성
    '/live/onair',   // 라이브 시청 (채팅 포함)
    '/mypage',       // 마이페이지
    '/verify',       // 인증 페이지
    '/notification', // 알림
  ]

  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

  // 보호된 경로인데 토큰이 없으면 로그인 페이지로 리다이렉트
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/onboard', req.url)
    loginUrl.searchParams.set('redirect', pathname)
    
    // 이전 페이지 정보 저장 (뒤로가기 문제 해결용)
    const referer = req.headers.get('referer')
    if (referer) {
      try {
        const refererUrl = new URL(referer)
        // 같은 도메인이고, onboard가 아닌 경우만 저장
        if (refererUrl.origin === req.nextUrl.origin && !refererUrl.pathname.startsWith('/onboard')) {
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
 * 주의: matcher는 정확한 경로 매칭이 필요
 * - /path: 해당 경로만
 * - /path/:param*: 해당 경로와 모든 하위 경로
 */
export const config = {
  matcher: [
    // 경매 결제
    '/auction/:id/payment',
    '/auction/:id/payment/:path*',
    
    // 채팅
    '/chat',
    '/chat/:path*',
    
    // 찜
    '/like',
    
    // 매물 등록
    '/listings/new',
    
    // 라이브
    '/live/create',
    '/live/create/:path*',
    '/live/onair/:id',
    
    // 마이페이지
    '/mypage',
    '/mypage/:path*',
    
    // 인증
    '/verify/:path*',
    
    // 알림
    '/notification',
  ],
}
