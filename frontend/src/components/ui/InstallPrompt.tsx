'use client'
import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

// iOS/Safari 판별
function isIOS() {
  if (typeof navigator === 'undefined') return false
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}
function isSafari() {
  if (typeof navigator === 'undefined') return false
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
}

export default function InstallPrompt() {
  const [isIosSafari] = useState<boolean>(() => isIOS() && isSafari())
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    // 크롬/엣지 등에서 발생하는 beforeinstallprompt 후킹
    const handler = (e: Event) => {
      const bip = e as BeforeInstallPromptEvent
      bip.preventDefault()
      setDeferred(bip)
      setOpen(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const onInstall = async () => {
    if (!deferred) return
    await deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
    setOpen(false)
  }

  // iOS는 beforeinstallprompt 없음
  if (isIosSafari) return null

  if (!open) return null

  return (
    <div className="fixed inset-x-0 bottom-20 z-[9999] mx-auto w-fit rounded-2xl bg-black/80 px-4 py-3 text-white shadow-lg">
      <span className="mr-3">앱을 설치해 보시겠어요?</span>
      <button
        onClick={onInstall}
        className="rounded-lg bg-white/10 px-3 py-1 hover:bg-white/20"
        aria-label="Install PWA"
      >
        설치
      </button>
      <button
        onClick={() => setOpen(false)}
        className="ml-2 rounded-lg bg-white/10 px-3 py-1 hover:bg-white/20"
        aria-label="Later"
      >
        나중에
      </button>
    </div>
  )
}
