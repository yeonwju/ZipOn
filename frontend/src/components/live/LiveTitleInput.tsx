'use client'

interface LiveTitleInputProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
}

/**
 * 라이브 방송 제목 입력 컴포넌트
 */
export default function LiveTitleInput({ value, onChange, maxLength = 50 }: LiveTitleInputProps) {
  return (
    <div className="bg-white px-4 py-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          라이브 제목 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="예: 강남역 원룸 실시간 투어"
          maxLength={maxLength}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm transition-colors outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <div className="mt-1 text-right text-xs text-gray-500">
          {value.length}/{maxLength}
        </div>
      </div>
    </div>
  )
}
