'use client'
import { useEffect } from 'react'

declare global {
  interface Window {
    __swReg?: ServiceWorkerRegistration
  }
}

export default function PwaProvider() {
  useEffect(() => {
    // dev/prod 토글: 환경변수로 제어
    if (process.env.NEXT_PUBLIC_PWA_ENABLE !== '1') return

    const isSecure = location.protocol === 'https:' || location.hostname === 'localhost'
    if (!isSecure || !('serviceWorker' in navigator)) return

    const swUrl = '/service-worker.js'
    navigator.serviceWorker
      .register(swUrl, { scope: '/' })
      .then(reg => {
        window.__swReg = reg

        // 새 SW 발견되면 UI에 알림 이벤트 발행
        reg.addEventListener('updatefound', () => {
          const nw = reg.installing
          if (!nw) return
          nw.addEventListener('statechange', () => {
            const installed = nw.state === 'installed'
            const hasOld = !!navigator.serviceWorker.controller
            if (installed && hasOld) {
              window.dispatchEvent(new CustomEvent('sw-update-available'))
            }
          })
        })
      })
      .catch(console.error)

    // 업데이트 적용 완료되면 자동 새로고침
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      location.reload()
    })
  }, [])

  return null
}
