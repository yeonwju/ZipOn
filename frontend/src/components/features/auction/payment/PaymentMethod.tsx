'use client'

interface PaymentMethodProps {
  onPayment?: () => void
  className?: string
}

export default function PaymentMethod({ onPayment, className }: PaymentMethodProps) {
  const handlePayment = () => {
    if (onPayment) {
      onPayment()
    }
  }

  return (
    <div className={className || 'rounded-2xl border border-gray-300 bg-gray-50 p-4'}>
      <h3 className="mb-3 text-base font-semibold text-gray-900">결제 수단</h3>
      <div className="flex flex-col gap-3">
        <div className="rounded-lg border border-gray-200 bg-white p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">가상계좌 입금</span>
            <span className="text-xs text-gray-500">계좌번호가 발급됩니다</span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          className="mt-2 w-full rounded-full bg-blue-500 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-600 active:bg-blue-700"
        >
          가상계좌 발급받기
        </button>
      </div>
    </div>
  )
}
