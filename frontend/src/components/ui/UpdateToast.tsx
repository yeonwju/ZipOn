'use client'
import { useEffect, useState } from 'react'

export default function UpdateToast() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onUpdate = () => setOpen(true)

    window.addEventListener('sw-update-available', onUpdate as EventListener)

    return () => {
      window.removeEventListener('sw-update-available', onUpdate as EventListener)
    }
  }, [])

  const applyNow = () => {
    const reg = window.__swReg
    const waiting = reg?.waiting
    if (waiting) {
      waiting.postMessage({ type: 'SKIP_WAITING' })
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-x-0 bottom-4 z-[9999] mx-auto w-fit rounded-2xl bg-black/80 px-4 py-3 text-white shadow-lg">
      <span className="mr-3">새 버전이 준비되었습니다.</span>
      <button onClick={applyNow} className="rounded-lg bg-white/10 px-3 py-1 hover:bg-white/20">
        지금 적용
      </button>
      <button
        onClick={() => setOpen(false)}
        className="ml-2 rounded-lg bg-white/10 px-3 py-1 hover:bg-white/20"
      >
        나중에
      </button>
    </div>
  )
}
