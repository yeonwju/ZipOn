'use client'

import { AlertCircle, PhoneOff } from 'lucide-react'
import { useState } from 'react'

interface LiveEndButtonProps {
  onEnd: () => void
}

/**
 * 방송 종료 버튼 (진행자 전용)
 * - 확인 모달 포함
 */
export default function LiveEndButton({ onEnd }: LiveEndButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleConfirmEnd = () => {
    setShowConfirm(false)
    onEnd()
  }

  return (
    <>
      {/* 방송 종료 버튼 */}
      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 font-semibold text-white shadow-lg transition-all hover:bg-red-600 active:scale-95"
      >
        <PhoneOff size={20} />
        방송 종료
      </button>

      {/* 확인 모달 */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            {/* 아이콘 */}
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-red-100 p-3">
                <AlertCircle size={32} className="text-red-500" />
              </div>
            </div>

            {/* 제목 */}
            <h3 className="mb-2 text-center text-xl font-bold text-gray-900">
              방송을 종료하시겠습니까?
            </h3>

            {/* 설명 */}
            <p className="mb-6 text-center text-sm text-gray-600">
              방송이 종료되면 다시 되돌릴 수 없습니다.
              <br />
              시청자들과의 연결이 끊어집니다.
            </p>

            {/* 버튼 */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleConfirmEnd}
                className="flex-1 rounded-lg bg-red-500 px-4 py-3 font-semibold text-white transition-colors hover:bg-red-600"
              >
                종료하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

