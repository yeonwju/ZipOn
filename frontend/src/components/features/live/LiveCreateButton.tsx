'use client'

interface LiveCreateButtonProps {
  /** 버튼 활성화 여부 */
  canCreateLive: boolean
  /** 제목 입력 여부 */
  hasTitle: boolean
  /** 주소 선택 여부 */
  hasAddress: boolean
  /** 현재 위치 존재 여부 */
  hasCurrentLocation: boolean
  /** 클릭 핸들러 */
  onClick?: () => void
}

/**
 * 라이브 방송 생성 버튼 (하단 고정)
 *
 * 조건에 따라 버튼 텍스트와 활성화 상태가 변경됩니다.
 */
export default function LiveCreateButton({
  canCreateLive,
  hasTitle,
  hasAddress,
  hasCurrentLocation,
  onClick,
}: LiveCreateButtonProps) {
  // 버튼 텍스트 결정
  const getButtonText = () => {
    if (!hasTitle) return '방송 제목을 입력해주세요'
    if (!hasAddress) return '주소를 먼저 선택해주세요'
    if (!hasCurrentLocation) return '위치 권한을 허용해주세요'
    if (!canCreateLive) return '매물에서 100m 이내로 이동해주세요'
    return '라이브 방송 시작하기'
  }

  return (
    <div className="fixed right-0 bottom-0 left-0 z-40 border-t border-gray-200 bg-white p-4 shadow-lg">
      <div className="mx-auto w-full max-w-2xl">
        <button
          onClick={onClick}
          disabled={!canCreateLive}
          className={`w-full rounded-lg px-6 py-4 text-base font-semibold transition-colors ${
            canCreateLive
              ? 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
              : 'cursor-not-allowed bg-gray-200 text-gray-400'
          }`}
        >
          {getButtonText()}
        </button>

        {canCreateLive && (
          <p className="mt-2 text-center text-xs text-gray-500">
            라이브 방송은 최대 1시간 동안 진행됩니다.
          </p>
        )}
      </div>
    </div>
  )
}

