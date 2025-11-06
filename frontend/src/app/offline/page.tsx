export default function OfflinePage() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold">오프라인 상태입니다</h1>
      <p className="mt-2 text-sm text-gray-600">네트워크 연결을 확인하고 다시 시도해 주세요.</p>
      <button
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
        onClick={() => location.reload()}
      >
        다시 시도
      </button>
    </main>
  )
}
