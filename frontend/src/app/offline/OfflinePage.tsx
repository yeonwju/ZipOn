import RefreshButton from './RefreshButton'

export const metadata = { title: '오프라인입니다' }

export default function OfflinePage() {
  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-xl font-semibold">오프라인 상태</h1>
      <p className="mt-2">네트워크 연결이 불안정합니다. 연결 후 다시 시도하세요.</p>
      <div className="mt-4">
        <RefreshButton />
      </div>
    </main>
  )
}
