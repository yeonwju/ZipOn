'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useAlertDialog } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUser, useVerifyBusiness } from '@/queries'

export default function BusinessVerificationForm() {
  const { data, refetch } = useUser()
  const { mutate: verifyBusinessMutation, isPending } = useVerifyBusiness()
  const { showSuccess, showError, AlertDialog } = useAlertDialog()

  const [businessNumber, setBusinessNumber] = useState('')
  const [businessNumberDisplay, setBusinessNumberDisplay] = useState('')

  // 플로우 상태
  const [isVerified, setIsVerified] = useState(false)

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

  // 사업자 인증 요청
  const handleVerify = () => {
    verifyBusinessMutation(
      { taxSeq: businessNumber },
      {
        onSuccess: result => {
          setIsVerified(true)
          refetch()
          showSuccess(result?.message || '사업자 인증이 완료되었습니다.')
        },
        onError: error => {
          showError(
            error instanceof Error
              ? error.message
              : '사업자 인증에 실패했습니다. 다시 시도해주세요.'
          )
        },
      }
    )
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
            value={data?.name || '홍길동'}
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
            value={data?.birth || '1998-10-10'}
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
              disabled={!canVerify || isPending || isVerified}
              variant="secondary"
              className="bg-blue-400 text-white"
            >
              {isPending ? '인증 중...' : '인증하기'}
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
              {data?.name}님의 사업자번호 <span className="font-bold">{businessNumberDisplay}</span>{' '}
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
      <AlertDialog />
    </div>
  )
}
