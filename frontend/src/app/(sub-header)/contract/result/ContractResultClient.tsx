'use client'

import { useAlertDialog } from '@/components/ui/alert-dialog'

export default function ContractResultClient() {
  const { showSuccess, AlertDialog } = useAlertDialog()

  // 📌 API에서 넘어오는 값(예시)
  const toxicClauses = [
    '임대인에게 일방적인 계약해지 권한이 과도하게 부여되어 있습니다.',
    '보증금 반환 기한이 명확히 규정되지 않아 분쟁 위험이 있습니다.',
    '임차인의 수리비 부담 범위가 지나치게 포괄적으로 설정되어 있습니다.',
  ]

  return (
    <div className="relative flex flex-col px-4 py-4 pb-28">
      {/* 상단 제목 */}
      <h2 className="mb-4 text-xl font-semibold">계약서 AI 검증 결과</h2>

      {/* 섹션 타이틀 */}
      <div className="mb-2 text-sm font-medium text-gray-600">검토가 필요한 조항들</div>

      {/* 독소조항 리스트 */}
      <div className="space-y-3">
        {toxicClauses.map((item, idx) => (
          <div key={idx} className="rounded-md border border-red-200 bg-red-50 px-3 py-2 shadow-sm">
            <div className="flex items-start gap-2">
              <span className="mt-1 text-red-600">•</span>
              <p className="text-sm leading-relaxed text-red-700">{item}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ✔ 책임고지 3줄 추가 */}
      <div className="mt-5 space-y-1 text-xs leading-relaxed text-gray-500">
        <p>• 본 AI 검증 결과는 참고용이며 법적 효력을 가지지 않습니다.</p>
        <p>• 계약 체결 여부 및 최종 판단 책임은 사용자 본인에게 있습니다.</p>
        <p>• 중요한 법적 결정 전에는 반드시 전문가의 검토를 받으시기 바랍니다.</p>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed right-0 bottom-0 left-0 z-20 bg-white px-4 pt-3 pb-4 shadow-[0_-2px_8px_rgba(0,0,0,0.08)]">
        <button
          onClick={() =>
            showSuccess(
              '확인을 누르시면 계약이 완료되고 결제하신 한달치 월세는 임대인에게 자동으로 송금이 됩니다.'
            )
          }
          className="w-full rounded-md bg-blue-500 py-3 font-bold text-white"
        >
          계약하기
        </button>
      </div>

      <AlertDialog />
    </div>
  )
}
