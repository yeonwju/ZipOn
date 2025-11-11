'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface BusinessVerificationFormProps {
  userName?: string | null
  userBirthDate?: string | null
  onComplete?: () => void
}

/**
 * 사업자 인증 폼 컴포넌트
 *
 * 플로우:
 * 1. 사용자 정보 자동 표시 (이름, 생년월일)
 * 2. 사업자 번호 입력
 * 3. 인증 요청
 * 4. 인증 완료
 */
export default function BusinessVerificationForm({
  userName = '',
  userBirthDate = '',
  onComplete,
}: BusinessVerificationFormProps) {
  // 입력 상태
  const [businessNumber, setBusinessNumber] = useState('')

  // 플로우 상태
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 입력 검증
  const canVerify = businessNumber.replace(/-/g, '').length === 10

  // 사업자 번호 포맷팅 (XXX-XX-XXXXX)
  const handleBusinessNumberChange = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 10) {
      let formatted = numbers
      if (numbers.length > 3 && numbers.length <= 5) {
        formatted = `${numbers.slice(0, 3)}-${numbers.slice(3)}`
      } else if (numbers.length > 5) {
        formatted = `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5)}`
      }
      setBusinessNumber(formatted)
    }
  }

  // 사업자 인증
  const handleVerify = async () => {
    setIsLoading(true)

    try {
      // TODO: API 호출
      // await verifyBusiness({ name: userName, birthDate: userBirthDate, businessNumber })

      // 임시: 성공 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000))

      setIsVerified(true)
    } catch (error) {
      console.error('사업자 인증 실패:', error)
      alert('사업자 인증에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 인증 완료
  const handleComplete = () => {
    onComplete?.()
  }

  return (
    <div className="space-y-6 p-6">
      {/* 헤더 */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">사업자 인증</h2>
        <p className="text-muted-foreground text-sm">
          중개업자 등록을 위해 사업자 인증이 필요합니다.
        </p>
      </div>

      {/* 사용자 정보 & 사업자 번호 입력 */}
      <div className="space-y-4">
        {/* 이름 (자동 입력) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="name">이름</Label>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>자동 입력</span>
            </div>
          </div>
          <div className="relative">
            <Input
              id="name"
              type="text"
              value={userName || '홍길동'}
              disabled
              className="input-underline cursor-not-allowed bg-gray-200 text-gray-500 opacity-60"
            />
          </div>
        </div>

        {/* 생년월일 (자동 입력) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="birth-date">생년월일</Label>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>자동 입력</span>
            </div>
          </div>
          <div className="relative">
            <Input
              id="birth-date"
              type="text"
              value={userBirthDate || '1998-10-10'}
              disabled
              className="input-underline cursor-not-allowed bg-gray-200 text-gray-500 opacity-60"
            />
          </div>
        </div>

        {/* 사업자 번호 */}
        <div className="space-y-2">
          <Label htmlFor="business-number">사업자등록번호</Label>
          <div className="flex gap-2">
            <Input
              id="business-number"
              type="text"
              placeholder="123-45-67890"
              value={businessNumber}
              onChange={e => handleBusinessNumberChange(e.target.value)}
              disabled={isVerified}
              className="input-underline flex-1"
              maxLength={12}
            />
            <Button
              type="button"
              onClick={handleVerify}
              disabled={!canVerify || isLoading || isVerified}
              variant={'secondary'}
              className={'bg-blue-400 text-white'}
            >
              {isLoading ? '인증 중...' : '인증하기'}
            </Button>
          </div>
          <p className="text-muted-foreground text-xs text-gray-400">
            사업자등록번호 10자리를 입력해주세요
          </p>
        </div>
      </div>

      {/* 인증 완료 상태 */}
      {isVerified && (
        <div className="animate-in fade-in-50 slide-in-from-top-3 space-y-4 duration-300">
          <div className="relative overflow-hidden rounded-lg border-1 border-green-300 bg-green-50 p-5 shadow-md">
            <div className="relative space-y-3">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-500 p-1.5 shadow-md">
                  <svg
                    className="size-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1 pt-0.5">
                  <p className="text-base font-bold text-green-900">사업자 인증이 완료되었습니다</p>
                  <p className="mt-1.5 text-sm text-green-700">
                    <span className="font-semibold">{userName}</span>님의 사업자등록번호{' '}
                    <span className="font-semibold">{businessNumber}</span>가 인증되었습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleComplete}
            className="w-full bg-blue-400 text-white shadow-md transition-all hover:bg-green-600 hover:shadow-lg active:scale-[0.98]"
            size="lg"
          >
            완료
          </Button>
        </div>
      )}
    </div>
  )
}
