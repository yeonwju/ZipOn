'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Home() {
  return (
    <div className="bg-background-2 min-h-screen font-sans">
      {/* 헤더 */}
      <header className="bg-background-1 border-custom-gray-2 border-b shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-primary-blue-1 text-xl font-bold">HomeOn</h1>
            </div>
            <nav className="hidden space-x-8 md:flex">
              <a href="#" className="text-gray-text hover:text-primary-blue-1 transition-colors">
                홈
              </a>
              <a href="#" className="text-gray-text hover:text-primary-blue-1 transition-colors">
                서비스
              </a>
              <a href="#" className="text-gray-text hover:text-primary-blue-1 transition-colors">
                소개
              </a>
              <a href="#" className="text-gray-text hover:text-primary-blue-1 transition-colors">
                연락처
              </a>
            </nav>
            <button className="text-gray-text md:hidden">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-12 text-center">
          <h2 className="text-primary-blue-1 mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
            UI 컴포넌트 반응형 테스트
          </h2>
          <p className="text-gray-text mx-auto mb-6 max-w-3xl text-lg sm:text-xl">
            Tailwind CSS v4 + shadcn/ui 컴포넌트를 한 화면에서 테스트할 수 있습니다.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="default">Tailwind CSS v4</Badge>
            <Badge variant="secondary">shadcn/ui</Badge>
            <Badge variant="outline">반응형 디자인</Badge>
            <Badge variant="destructive">Next.js 16</Badge>
          </div>
        </section>

        {/* Components */}
        <div className="mb-12">
          <div className="mb-8 flex flex-wrap gap-2">
            <span className="rounded-md border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-700">
              버튼
            </span>
            <span className="rounded-md border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-700">
              배지
            </span>
            <span className="rounded-md border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-700">
              폼
            </span>
          </div>

          {/* Buttons */}
          <div className="space-y-6">
            <h3 className="text-primary-blue-2 text-2xl font-bold">Button 컴포넌트</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <h4 className="text-gray-text mb-2 font-semibold">Variants</h4>
                <div className="space-y-2">
                  <Button className="w-full text-white">Default</Button>
                  <Button variant="secondary" className="w-full">
                    Secondary
                  </Button>
                  <Button variant="outline" className="w-full">
                    Outline
                  </Button>
                  <Button variant="ghost" className="w-full">
                    Ghost
                  </Button>
                  <Button variant="link" className="w-full">
                    Link
                  </Button>
                  <Button variant="destructive" className="w-full">
                    Destructive
                  </Button>
                </div>
              </div>
              <div>
                <h4 className="text-gray-text mb-2 font-semibold">Sizes</h4>
                <div className="space-y-2">
                  <Button size="sm" className="w-full text-white">
                    Small
                  </Button>
                  <Button size="default" className="w-full text-white">
                    Default
                  </Button>
                  <Button size="lg" className="w-full text-white">
                    Large
                  </Button>
                  <Button size="icon" className="w-full text-white">
                    Icon
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="space-y-6">
            <h3 className="text-primary-blue-2 text-2xl font-bold">Badge 컴포넌트</h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </div>

          {/* Forms */}
          <div className="space-y-6">
            <h3 className="text-primary-blue-2 text-2xl font-bold">Input 컴포넌트</h3>
            <div className="space-y-3 sm:w-1/2">
              <Input placeholder="기본 입력" />
              <Input type="email" placeholder="이메일 입력" />
              <Input type="password" placeholder="비밀번호 입력" />
            </div>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-custom-gray-3 border-custom-gray-2 border-t">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center sm:px-6 lg:px-8">
          <p className="text-gray-text text-sm">
            © 2024 HomeOn — Tailwind CSS v4 + shadcn/ui 테스트 페이지
          </p>
        </div>
      </footer>
    </div>
  )
}
