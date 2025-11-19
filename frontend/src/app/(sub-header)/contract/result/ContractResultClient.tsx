'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useAlertDialog } from '@/components/ui/alert-dialog'
import { useContractSuccess } from '@/queries/useContract'

// sessionStorage에서 검증 결과를 읽어오는 함수
function getStoredVerifyResult(): string[] {
  if (typeof window === 'undefined') return []

  try {
    const storedResult = sessionStorage.getItem('contractVerifyResult')
    if (!storedResult) return []

    const parsed = JSON.parse(storedResult)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    console.error('검증 결과 파싱 오류:', err)
    return []
  }
}

export default function ContractResultClient() {
  const router = useRouter()
  const { showSuccess, showError, AlertDialog } = useAlertDialog()
  const searchParams = useSearchParams()

  const [lines] = useState<string[]>(() => getStoredVerifyResult())

  const rawContractSeq = searchParams.get('contractSeq')
  const contractSeq = rawContractSeq ? Number(rawContractSeq) : null

  const { mutate: completeContract, isPending } = useContractSuccess(contractSeq ?? 0)

  useEffect(() => {
    if (lines.length === 0) {
      showError('검증 결과를 찾을 수 없습니다.')
      router.push('/contract')
    }
  }, [lines.length, router, showError])

  return (
    <div className="relative flex flex-col px-4 py-4 pb-28">
      {/* 상단 제목 */}
      <h2 className="mb-4 text-xl font-semibold">계약서 AI 검증 결과</h2>

      {/* 섹션 타이틀 */}
      <div className="mb-2 text-sm font-medium text-gray-600">검토가 필요한 조항들</div>

      {/* 독소조항 리스트 */}
      {lines.length > 0 ? (
        <div className="space-y-3">
          {lines.map((line, idx) => (
            <div
              key={idx}
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2 shadow-sm"
            >
              <div className="flex items-start gap-2">
                <span className="mt-1 text-red-600">•</span>
                <p className="text-sm leading-relaxed text-red-700">{line}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-4 text-center text-sm text-gray-500">
          검토가 필요한 조항이 없습니다.
        </div>
      )}

      {/* 책임고지 */}
      <div className="mt-5 space-y-1 text-xs leading-relaxed text-gray-500">
        <p>• 본 AI 검증 결과는 참고용이며 법적 효력을 가지지 않습니다.</p>
        <p>• 계약 체결 여부 및 최종 판단 책임은 사용자 본인에게 있습니다.</p>
        <p>• 중요한 법적 결정 전에는 반드시 전문가의 검토를 받으시기 바랍니다.</p>
      </div>

      {/* 하단 버튼 */}
      <div className="fixed right-0 bottom-0 left-0 z-20 bg-white px-4 pt-3 pb-4 shadow-[0_-2px_8px_rgba(0,0,0,0.08)]">
        <button
          onClick={() => {
            if (!contractSeq) {
              showError('계약 정보가 올바르지 않습니다.')
              return
            }

            completeContract(undefined, {
              onSuccess: () => {
                router.push('/contract/complete')
              },
              onError: error => {
                showError(
                  error instanceof Error
                    ? error.message
                    : '계약 완료에 실패했습니다. 다시 시도해주세요.'
                )
              },
            })
          }}
          disabled={isPending || !contractSeq}
          className="w-full rounded-md bg-blue-500 py-3 font-bold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isPending ? '처리 중...' : '계약하기'}
        </button>
      </div>

      <AlertDialog />
    </div>
  )
}
