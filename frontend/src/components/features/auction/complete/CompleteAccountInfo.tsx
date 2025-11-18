'use client'

import { useAlertDialog } from '@/components/ui/alert-dialog'
import { formatCurrency } from '@/utils/format'

interface CompleteAccountInfoProps {
  accountNumber: string
  accountHolder: string
  totalAmount: number
}

export default function CompleteAccountInfo({
  accountNumber,
  accountHolder,
  totalAmount,
}: CompleteAccountInfoProps) {
  const { showSuccess, AlertDialog } = useAlertDialog()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(accountNumber)
    showSuccess('계좌번호가 복사되었습니다')
  }

  return (
    <>
      <div className="rounded-2xl border border-gray-300 bg-gray-50 p-4">
        <h3 className="mb-3 text-base font-semibold text-gray-900">가상계좌 정보</h3>
        <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">은행</span>
            <span className="text-sm font-medium text-gray-900">싸피은행</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">계좌번호</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">{accountNumber}</span>
              <button
                onClick={copyToClipboard}
                className="rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-50"
              >
                복사
              </button>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">예금주</span>
            <span className="text-sm font-medium text-gray-900">{accountHolder}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">입금 금액</span>
            <span className="text-sm font-bold text-blue-600">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          * 입금 기한 내에 정확한 금액을 입금해주세요.
          <br />* 입금자명이 다를 경우 입금 확인이 지연될 수 있습니다.
        </p>
      </div>
      <AlertDialog />
    </>
  )
}
