'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { API_ENDPOINTS } from '@/constants'
import { useUser } from '@/hooks/queries'
import { authFetch } from '@/lib/fetch'

interface BusinessVerificationFormProps {
  userName?: string | null
  userBirthDate?: string | null
  onComplete?: () => void
}

export default function BusinessVerificationForm({
  userName = '',
  userBirthDate = '',
  onComplete,
}: BusinessVerificationFormProps) {
  const [businessNumber, setBusinessNumber] = useState('')
  const [businessNumberDisplay, setBusinessNumberDisplay] = useState('')

  // 플로우 상태
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 입력 검증
  const canVerify = businessNumber.length === 10

  const handleBusinessNumberChange = (value: string) => {
    const raw = value.replace(/\D/g, '')
    setBusinessNumber(raw)

    let formatted = raw
    if (raw.length > 3 && raw.length <= 5) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`
    } else if (raw.length > 5) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3, 5)}-${raw.slice(5)}`
    }
    setBusinessNumberDisplay(formatted)
  }

  const router = useRouter()
  const { refetch } = useUser()

  // 사업자 인증 요청
  const handleVerify = async () => {
    try {
      setIsLoading(true)

      // 페이로드 생성
      const payload = {
        taxSeq: businessNumber,
      }

      console.log('=== 사업자 인증 요청 ===')
      console.log('엔드포인트:', API_ENDPOINTS.BUSSINESS_REGISTER)
      console.log('페이로드:', payload)
      console.log('사업자번호:', businessNumber)
      console.log('사업자번호 길이:', businessNumber.length)
      console.log('사업자번호 타입:', typeof businessNumber)

      const result = await authFetch.post<UserVerifyResponse>(
        API_ENDPOINTS.BUSSINESS_REGISTER,
        payload
      )

      console.log('=== 사업자 인증 응답 ===')
      console.log('응답:', result)
      console.log('응답 타입:', typeof result)

      // authFetch는 성공 시 JSON body를 반환 (에러 시 throw)
      // 따라서 여기 도달했다면 성공
      setIsVerified(true)
      refetch()
    } catch (err) {
      console.error('=== 사업자 인증 에러 ===')
      console.error('에러 상세:', err)
      console.error('에러 메시지:', err instanceof Error ? err.message : String(err))

      // 사용자에게 에러 메시지 표시
      alert(
        err instanceof Error
          ? `사업자 인증 중 오류가 발생했습니다.\n${err.message}`
          : '사업자 인증 중 오류가 발생했습니다.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleComplete = () => {
    router.replace('/mypage')
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">사업자 인증</h2>
        <p className="text-muted-foreground text-sm">
          중개업자 등록을 위해 사업자 인증이 필요합니다.
        </p>
      </div>

      <div className="space-y-4">
        {/* 이름 */}
        <div className="space-y-2">
          <Label htmlFor="name">이름</Label>
          <Input
            id="name"
            type="text"
            value={userName || '홍길동'}
            disabled
            className="input-underline bg-gray-200 text-gray-500/80"
          />
        </div>

        {/* 생년월일 */}
        <div className="space-y-2">
          <Label htmlFor="birth-date">생년월일</Label>
          <Input
            id="birth-date"
            type="text"
            value={userBirthDate || '1998-10-10'}
            disabled
            className="input-underline bg-gray-200 text-gray-500/80"
          />
        </div>

        {/* 사업자 번호 */}
        <div className="space-y-2">
          <Label htmlFor="business-number">사업자등록번호</Label>
          <div className="flex gap-2">
            <Input
              id="business-number"
              type="text"
              placeholder="123-45-67890"
              value={businessNumberDisplay}
              onChange={e => handleBusinessNumberChange(e.target.value)}
              disabled={isVerified}
              className="input-underline flex-1"
              maxLength={12}
            />
            <Button
              type="button"
              onClick={handleVerify}
              disabled={!canVerify || isLoading || isVerified}
              variant="secondary"
              className="bg-blue-400 text-white"
            >
              {isLoading ? '인증 중...' : '인증하기'}
            </Button>
          </div>
          <p className="text-xs text-gray-400">사업자등록번호 10자리를 입력해주세요</p>
        </div>
      </div>

      {isVerified && (
        <div className="animate-in fade-in-50 slide-in-from-top-3 space-y-4">
          <div className="rounded-lg border border-green-300 bg-green-50 p-4 shadow-sm">
            <p className="font-semibold text-green-900">사업자 인증이 완료되었습니다 ✅</p>
            <p className="mt-1 text-sm text-green-700">
              {userName}님의 사업자번호 <span className="font-bold">{businessNumberDisplay}</span>{' '}
              가 인증되었습니다.
            </p>
          </div>

          <Button
            type="button"
            onClick={handleComplete}
            className="w-full bg-blue-400 text-white hover:bg-blue-500"
            size="lg"
          >
            완료
          </Button>
        </div>
      )}
    </div>
  )
}
