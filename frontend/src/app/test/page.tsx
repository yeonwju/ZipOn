import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

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
        {/* 히어로 섹션 */}
        <section className="mb-12 text-center">
          <h2 className="text-primary-blue-1 mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
            UI 컴포넌트 반응형 예시
          </h2>
          <p className="text-gray-text mx-auto mb-6 max-w-3xl text-lg sm:text-xl">
            Tailwind CSS v4와 shadcn/ui 컴포넌트를 활용한 반응형 디자인 예시입니다.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="default">Tailwind CSS v4</Badge>
            <Badge variant="secondary">shadcn/ui</Badge>
            <Badge variant="outline">반응형 디자인</Badge>
            <Badge variant="destructive">Next.js 16</Badge>
          </div>
        </section>

        {/* 브레이크포인트 표시 */}
        <section className="mb-12">
          <h3 className="text-primary-blue-2 mb-6 text-2xl font-bold">현재 브레이크포인트</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <div className="bg-primary-blue-1 rounded-lg p-4 text-center text-white">
              <div className="font-bold">SM</div>
              <div className="text-sm opacity-90">430px+</div>
            </div>
            <div className="bg-primary-blue-2 rounded-lg p-4 text-center text-white">
              <div className="font-bold">MD</div>
              <div className="text-sm opacity-90">768px+</div>
            </div>
            <div className="bg-custom-gray-1 rounded-lg p-4 text-center text-white">
              <div className="font-bold">LG</div>
              <div className="text-sm opacity-90">1024px+</div>
            </div>
            <div className="bg-gray-text rounded-lg p-4 text-center text-white">
              <div className="font-bold">XL</div>
              <div className="text-sm opacity-90">1280px+</div>
            </div>
            <div className="bg-gray-background text-primary-blue-1 border-primary-blue-1 rounded-lg border-2 p-4 text-center">
              <div className="font-bold">2XL</div>
              <div className="text-sm opacity-90">1536px+</div>
            </div>
          </div>
        </section>

        {/* 색상 팔레트 */}
        <section className="mb-12">
          <h3 className="text-primary-blue-2 mb-6 text-2xl font-bold">커스텀 색상 팔레트</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <div className="bg-primary-blue-1 rounded-lg p-4 text-white">
              <div className="font-bold">Primary Blue 1</div>
              <div className="text-sm opacity-90">#4A84FF</div>
            </div>
            <div className="bg-primary-blue-2 rounded-lg p-4 text-white">
              <div className="font-bold">Primary Blue 2</div>
              <div className="text-sm opacity-90">#246EFF</div>
            </div>
            <div className="bg-error rounded-lg p-4 text-white">
              <div className="font-bold">Error</div>
              <div className="text-sm opacity-90">#DD5657</div>
            </div>
            <div className="bg-background-1 text-primary-blue-1 border-custom-gray-2 rounded-lg border p-4">
              <div className="font-bold">Background 1</div>
              <div className="text-sm opacity-90">#FFFFFF</div>
            </div>
            <div className="bg-background-2 text-primary-blue-1 rounded-lg p-4">
              <div className="font-bold">Background 2</div>
              <div className="text-sm opacity-90">#ECF0FB</div>
            </div>
            <div className="bg-custom-gray-1 rounded-lg p-4 text-white">
              <div className="font-bold">Custom Gray 1</div>
              <div className="text-sm opacity-90">#8C8C8C</div>
            </div>
            <div className="bg-custom-gray-2 text-primary-blue-1 rounded-lg p-4">
              <div className="font-bold">Custom Gray 2</div>
              <div className="text-sm opacity-90">#D9D9D9</div>
            </div>
            <div className="bg-custom-gray-3 text-primary-blue-1 rounded-lg p-4">
              <div className="font-bold">Custom Gray 3</div>
              <div className="text-sm opacity-90">#F5F5F5</div>
            </div>
            <div className="bg-gray-text rounded-lg p-4 text-white">
              <div className="font-bold">Gray Text</div>
              <div className="text-sm opacity-90">#919191</div>
            </div>
            <div className="bg-gray-background text-primary-blue-1 rounded-lg p-4">
              <div className="font-bold">Gray Background</div>
              <div className="text-sm opacity-90">#DBDBDB</div>
            </div>
          </div>
        </section>

        {/* 반응형 카드 그리드 */}
        <section className="mb-12">
          <h3 className="text-primary-blue-2 mb-6 text-2xl font-bold">반응형 카드 그리드</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
              <div
                key={item}
                className="bg-background-1 border-custom-gray-2 rounded-lg border p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="bg-primary-blue-1 mb-4 flex h-32 w-full items-center justify-center rounded-lg">
                  <span className="text-xl font-bold text-white">카드 {item}</span>
                </div>
                <h4 className="text-primary-blue-1 mb-2 font-bold">카드 제목 {item}</h4>
                <p className="text-gray-text text-sm">
                  이 카드는 반응형 그리드에서 자동으로 레이아웃이 조정됩니다. 화면 크기에 따라 열의
                  개수가 변경됩니다.
                </p>
                <button className="bg-primary-blue-2 hover:bg-primary-blue-1 mt-4 w-full rounded-lg px-4 py-2 text-white transition-colors">
                  자세히 보기
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 반응형 텍스트 */}
        <section className="mb-12">
          <h3 className="text-primary-blue-2 mb-6 text-2xl font-bold">반응형 텍스트</h3>
          <div className="space-y-4">
            <p className="text-gray-text text-sm sm:text-base lg:text-lg xl:text-xl">
              이 텍스트는 화면 크기에 따라 폰트 크기가 변경됩니다.
            </p>
            <div className="bg-custom-gray-3 rounded-lg p-4">
              <p className="text-primary-blue-1 text-xs font-medium sm:text-sm md:text-base lg:text-lg">
                SM: 12px → MD: 14px → LG: 16px → XL: 18px
              </p>
            </div>

            {/* 폰트 사이즈 테스트 */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-background-1 border-custom-gray-2 rounded-lg border p-4">
                <h4 className="text-primary-blue-1 mb-2 text-lg font-bold">기본 텍스트</h4>
                <p className="text-gray-text text-sm sm:text-base lg:text-lg">
                  반응형 폰트 사이즈 테스트
                </p>
              </div>
              <div className="bg-background-1 border-custom-gray-2 rounded-lg border p-4">
                <h4 className="text-primary-blue-2 mb-2 text-xl font-bold">큰 텍스트</h4>
                <p className="text-gray-text text-base sm:text-lg lg:text-xl">
                  큰 폰트 사이즈 테스트
                </p>
              </div>
              <div className="bg-background-1 border-custom-gray-2 rounded-lg border p-4">
                <h4 className="text-error mb-2 text-2xl font-bold">제목 텍스트</h4>
                <p className="text-gray-text text-lg sm:text-xl lg:text-2xl">
                  제목 폰트 사이즈 테스트
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* UI 컴포넌트 예시 */}
        <Tabs defaultValue="buttons" className="mb-12">
          <TabsList className="mb-8 grid w-full grid-cols-4 sm:grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="buttons">버튼</TabsTrigger>
            <TabsTrigger value="badges">배지</TabsTrigger>
            <TabsTrigger value="alerts">알림</TabsTrigger>
            <TabsTrigger value="forms">폼</TabsTrigger>
          </TabsList>

          <TabsContent value="buttons" className="space-y-6">
            <div>
              <h3 className="text-primary-blue-2 mb-4 text-2xl font-bold">Button 컴포넌트</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-3">
                  <h4 className="text-gray-text font-semibold">Variants</h4>
                  <div className="space-y-2">
                    <Button variant="default" className="w-full text-white">
                      Default
                    </Button>
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
                <div className="space-y-3">
                  <h4 className="text-gray-text font-semibold">Sizes</h4>
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
                <div className="space-y-3">
                  <h4 className="text-gray-text font-semibold">반응형 버튼</h4>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button className="flex-1 text-white">모바일: 세로</Button>
                    <Button variant="outline" className="flex-1">
                      태블릿: 가로
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <div>
              <h3 className="text-primary-blue-2 mb-4 text-2xl font-bold">Badge 컴포넌트</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-3">
                  <h4 className="text-gray-text font-semibold">Variants</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-gray-text font-semibold">상태 표시</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">완료</Badge>
                    <Badge variant="secondary">진행중</Badge>
                    <Badge variant="outline">대기</Badge>
                    <Badge variant="destructive">오류</Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-gray-text font-semibold">기술 스택</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">React</Badge>
                    <Badge variant="secondary">TypeScript</Badge>
                    <Badge variant="outline">Tailwind</Badge>
                    <Badge variant="destructive">Next.js</Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div>
              <h3 className="text-primary-blue-2 mb-4 text-2xl font-bold">Alert 컴포넌트</h3>
              <div className="space-y-4">
                <Alert>
                  <AlertTitle>기본 알림</AlertTitle>
                  <AlertDescription>
                    이것은 기본 알림 메시지입니다. 중요한 정보를 사용자에게 전달할 때 사용합니다.
                  </AlertDescription>
                </Alert>

                <Alert variant="destructive">
                  <AlertTitle>오류 알림</AlertTitle>
                  <AlertDescription>
                    이것은 오류 알림 메시지입니다. 문제가 발생했을 때 사용자에게 알려줍니다.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="forms" className="space-y-6">
            <div>
              <h3 className="text-primary-blue-2 mb-4 text-2xl font-bold">Form 컴포넌트</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-text mb-2 block text-sm font-medium">이름</label>
                    <Input placeholder="이름을 입력하세요" />
                  </div>
                  <div>
                    <label className="text-gray-text mb-2 block text-sm font-medium">이메일</label>
                    <Input type="email" placeholder="이메일을 입력하세요" />
                  </div>
                  <div>
                    <label className="text-gray-text mb-2 block text-sm font-medium">메시지</label>
                    <Input placeholder="메시지를 입력하세요" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-background-1 border-custom-gray-2 rounded-lg border p-4">
                    <h4 className="text-primary-blue-1 mb-2 font-semibold">폼 정보</h4>
                    <p className="text-gray-text text-sm">
                      반응형 폼 레이아웃입니다. 모바일에서는 세로 배치, 태블릿 이상에서는 가로
                      배치됩니다.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button className="flex-1">제출</Button>
                    <Button variant="outline" className="flex-1">
                      취소
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* 푸터 */}
      <footer className="bg-custom-gray-3 border-custom-gray-2 border-t">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h4 className="text-primary-blue-1 mb-4 font-bold">HomeOn</h4>
              <p className="text-gray-text mb-4 text-sm">
                Tailwind CSS v4와 shadcn/ui 컴포넌트를 활용한 반응형 웹 디자인 예시입니다.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">v4</Badge>
                <Badge variant="secondary">shadcn/ui</Badge>
                <Badge variant="default">반응형</Badge>
              </div>
            </div>
            <div>
              <h4 className="text-primary-blue-1 mb-4 font-bold">브레이크포인트</h4>
              <ul className="text-gray-text space-y-2 text-sm">
                <li>SM: 430px+</li>
                <li>MD: 768px+</li>
                <li>LG: 1024px+</li>
                <li>XL: 1280px+</li>
                <li>2XL: 1536px+</li>
              </ul>
            </div>
            <div>
              <h4 className="text-primary-blue-1 mb-4 font-bold">기술 스택</h4>
              <ul className="text-gray-text space-y-2 text-sm">
                <li>Next.js 16</li>
                <li>Tailwind CSS v4</li>
                <li>TypeScript</li>
                <li>React 19</li>
                <li>shadcn/ui</li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="text-center">
            <p className="text-gray-text text-sm">
              © 2024 HomeOn. Tailwind CSS v4 + shadcn/ui 반응형 예시 페이지
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
