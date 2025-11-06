import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * 인증이 필요한 경로 보호 미들웨어
 */
export function middleware(req: NextRequest) {
  const token = req.cookies.get('AT')?.value
  const pathname = req.nextUrl.pathname

  // 인증이 필요한 경로
  const protectedPaths = ['/mypage', '/auction/create', '/listing/edit']
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

  // 보호된 경로인데 토큰이 없으면 로그인 페이지로 리다이렉트
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/onboard', req.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// 적용할 경로 패턴 설정
export const config = {
  // :path*는 하위 경로에만 매칭되므로, 경로 자체도 포함하도록 설정
  matcher: [
    '/mypage',
    '/mypage/:path*',
    '/auction/create',
    '/auction/create/:path*',
    '/listing/edit',
    '/listing/edit/:path*',
  ],
}
