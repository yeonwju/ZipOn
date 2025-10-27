'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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

        {/* Tabs */}
        <Tabs defaultValue="buttons" className="mb-12">
          <TabsList className="mb-8 grid w-full grid-cols-5 sm:grid-cols-3 lg:grid-cols-5">
            <TabsTrigger value="buttons">버튼</TabsTrigger>
            <TabsTrigger value="badges">배지</TabsTrigger>
            <TabsTrigger value="alerts">알림</TabsTrigger>
            <TabsTrigger value="forms">폼</TabsTrigger>
            <TabsTrigger value="selects">셀렉트</TabsTrigger>
          </TabsList>

          {/* Buttons */}
          <TabsContent value="buttons" className="space-y-6">
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
          </TabsContent>

          {/* Badges */}
          <TabsContent value="badges" className="space-y-6">
            <h3 className="text-primary-blue-2 text-2xl font-bold">Badge 컴포넌트</h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </TabsContent>

          {/* Alerts */}
          <TabsContent value="alerts" className="space-y-6">
            <h3 className="text-primary-blue-2 text-2xl font-bold">Alert 컴포넌트</h3>
            <Alert>
              <AlertTitle>기본 알림</AlertTitle>
              <AlertDescription>이것은 기본 알림 메시지입니다.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertTitle>오류 알림</AlertTitle>
              <AlertDescription>문제가 발생했습니다.</AlertDescription>
            </Alert>
          </TabsContent>

          {/* Forms */}
          <TabsContent value="forms" className="space-y-6">
            <h3 className="text-primary-blue-2 text-2xl font-bold">Input 컴포넌트</h3>
            <div className="space-y-3 sm:w-1/2">
              <Input placeholder="기본 입력" />
              <Input type="email" placeholder="이메일 입력" />
              <Input type="password" placeholder="비밀번호 입력" />
            </div>
          </TabsContent>

          {/* Selects */}
          <TabsContent value="selects" className="space-y-6">
            <h3 className="text-primary-blue-2 text-2xl font-bold">Select 컴포넌트</h3>
            <div className="flex flex-col gap-4 sm:w-1/3">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>운동 부위</SelectLabel>
                    <SelectItem value="full">전신</SelectItem>
                    <SelectItem value="upper">상체</SelectItem>
                    <SelectItem value="lower">하체</SelectItem>
                    <SelectItem value="core">복부</SelectItem>
                    <SelectSeparator />
                    <SelectItem value="stretch">스트레칭</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="시간 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>운동 시간</SelectLabel>
                    <SelectItem value="short">10분 이내</SelectItem>
                    <SelectItem value="medium">10~30분</SelectItem>
                    <SelectItem value="long">30분 이상</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
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
