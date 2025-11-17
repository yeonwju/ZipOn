'use client'

export default function RefreshButton() {
  const onClick = () => window.location.reload()
  return (
    <button onClick={onClick} className="rounded-md border px-3 py-2">
      새로고침
    </button>
  )
}
