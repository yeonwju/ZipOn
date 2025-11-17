'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

import { useAlertDialog } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRequestPhoneVerification, useUser, useVerifyPhoneCode } from '@/queries'

export default function PhoneVerificationForm() {
  const [name, setName] = useState('')
  const [birth, setBirth] = useState('')
  const [genderDigit, setGenderDigit] = useState('')
  const [tel, setTel] = useState('')
  const [verificationCode, setVerificationCode] = useState('')

  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const router = useRouter()
  const { refetch } = useUser()
  const { mutate: requestPhoneVerificationMutation, isPending: isRequesting } =
    useRequestPhoneVerification()
  const { mutate: verifyPhoneCodeMutation, isPending: isVerifying } = useVerifyPhoneCode()
  const { showSuccess, showError, AlertDialog } = useAlertDialog()

  const [timer] = useState(180)

  const genderInputRef = useRef<HTMLInputElement>(null)

  const isPersonalInfoValid = name.length >= 2 && birth.length === 6 && genderDigit.length === 1
  const isPhoneNumberValid = tel.replace(/-/g, '').length === 11
  const canRequestCode = isPersonalInfoValid && isPhoneNumberValid
  const canVerify = verificationCode.length === 6

  const handleBirthDateChange = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 6) setBirth(numbers)
  }

  const handleGenderDigitChange = (value: string) => {
    const number = value.replace(/\D/g, '')
    if (number.length <= 1 && (number === '' || ['1', '2', '3', '4'].includes(number))) {
      setGenderDigit(number)
    }
  }

  const handlePhoneNumberChange = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      let formatted = numbers
      if (numbers.length > 3 && numbers.length <= 7) {
        formatted = `${numbers.slice(0, 3)}-${numbers.slice(3)}`
      } else if (numbers.length > 7) {
        formatted = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`
      }
      setTel(formatted)
    }
  }

  const handleVerificationCodeChange = (value: string) => {
    if (value.length <= 6) setVerificationCode(value)
  }

  // 휴대폰 인증번호 요청
  const handleRequestCode = () => {
    requestPhoneVerificationMutation(
      {
        name,
        birth,
        tel,
      },
      {
        onSuccess: result => {
          setIsCodeSent(true)
          showSuccess(result?.message || '인증번호가 발송되었습니다.')
        },
        onError: error => {
          showError(
            error instanceof Error
              ? error.message
              : '인증번호 발송에 실패했습니다. 다시 시도해주세요.'
          )
        },
      }
    )
  }

  // 인증번호 확인
  const handleVerifyCode = () => {
    verifyPhoneCodeMutation(
      {
        code: verificationCode,
      },
      {
        onSuccess: result => {
          setIsVerified(true)
          refetch()
          showSuccess(result?.message || '휴대폰 인증이 완료되었습니다.')
        },
        onError: error => {
          showError(
            error instanceof Error
              ? error.message
              : '인증번호가 일치하지 않습니다. 다시 시도해주세요.'
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
        <h2 className="text-2xl font-bold">휴대폰 인증</h2>
        <p className="text-muted-foreground text-sm">본인 확인을 위해 휴대폰 인증이 필요합니다.</p>
      </div>

      <div className="space-y-4">
        {/* 이름 */}
        <div className="space-y-2">
          <Label htmlFor="name">이름</Label>
          <Input
            id="name"
            type="text"
            placeholder="홍길동"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={isVerified}
            className="input-underline"
            maxLength={30}
          />
        </div>

        {/* 주민등록번호 */}
        <div className="space-y-2">
          <Label htmlFor="birth">주민등록번호</Label>
          <div className="flex flex-row items-center justify-between">
            <Input
              id="birth"
              type="text"
              placeholder="980919"
              value={birth}
              onChange={e => handleBirthDateChange(e.target.value)}
              disabled={isVerified}
              className="input-underline w-35"
              maxLength={6}
            />
            <span className="text-muted-foreground">-</span>

            {/*  여기 전체 아래줄 + 클릭 시 input focus 이동 */}
            <div
              className="flex w-35 cursor-text flex-row items-center gap-1 border-b border-gray-300 transition-colors focus-within:border-b-blue-400"
              onClick={() => genderInputRef.current?.focus()}
            >
              <Input
                ref={genderInputRef}
                type="text"
                placeholder="1"
                value={genderDigit}
                onChange={e => handleGenderDigitChange(e.target.value)}
                disabled={isVerified}
                className="input-underline-none w-5 border-none px-0 text-center"
                maxLength={1}
              />
              <span className="text-muted-foreground flex-1 select-none">● ● ● ● ● ●</span>
            </div>
          </div>
          <p className="text-muted-foreground text-xs text-gray-400">
            생년월일 6자리 - 뒷자리 첫 번째 숫자
          </p>
        </div>

        {/* 휴대폰 */}
        <div className="space-y-2">
          <Label htmlFor="tel">휴대폰 번호</Label>
          <div className="flex gap-2">
            <Input
              id="tel"
              type="tel"
              placeholder="010-1234-5678"
              value={tel}
              onChange={e => handlePhoneNumberChange(e.target.value)}
              disabled={isVerified}
              className="input-underline flex-1"
            />
            <Button
              type="button"
              onClick={handleRequestCode}
              disabled={!canRequestCode || isRequesting || isVerified}
              variant={'secondary'}
              className={'bg-blue-400 text-white'}
            >
              {isRequesting ? '전송 중...' : isCodeSent ? '재전송' : '인증번호 받기'}
            </Button>
          </div>
        </div>
      </div>

      {/* 인증번호 입력 */}
      {isCodeSent && !isVerified && (
        <div className="animate-in fade-in-50 slide-in-from-top-3 space-y-4 duration-300">
          <div className="relative overflow-hidden rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 shadow-sm">
            <div className="relative space-y-2">
              <div className="flex items-start gap-2">
                <div className="mt-0.5 rounded-full bg-blue-500 p-1">
                  <svg
                    className="size-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900">인증번호가 발송되었습니다</p>
                  <p className="mt-1 text-xs text-blue-700">
                    입력하신 휴대폰 번호로 발송된 6자리 인증번호를 입력해주세요.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="code">인증번호</Label>
              <span className="text-primary text-sm font-medium">
                {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <div className="flex gap-2">
              <Input
                id="code"
                type="text"
                placeholder="ABCDEF"
                value={verificationCode}
                onChange={e => handleVerificationCodeChange(e.target.value)}
                className="input-underline flex-1"
                maxLength={6}
              />
              <Button
                type="button"
                variant={'secondary'}
                onClick={handleVerifyCode}
                disabled={!canVerify || isVerifying}
                className={'bg-blue-400 text-white'}
              >
                {isVerifying ? '확인 중...' : '인증확인'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 인증 완료 */}
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
                  <p className="text-base font-bold text-green-900">휴대폰 인증이 완료되었습니다</p>
                  <p className="mt-1.5 text-sm text-green-700">
                    <span className="font-semibold">{name}</span>님의 휴대폰 번호
                    <span className="font-semibold">{tel}</span>가 인증되었습니다.
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
      <AlertDialog />
    </div>
  )
}
