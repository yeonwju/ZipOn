interface CompleteHeaderProps {
  address: string
  propertyName: string
}

export default function CompleteHeader({ address, propertyName }: CompleteHeaderProps) {
  return (
    <div className="text-center">
      <div className="mb-4 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <svg
            className="h-8 w-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>
      <h2 className="text-xl font-bold text-gray-900">가상계좌 발급 완료</h2>
      <p className="mt-2 text-sm text-gray-600">{address}</p>
      <p className="text-xs text-gray-500">{propertyName}</p>
    </div>
  )
}

