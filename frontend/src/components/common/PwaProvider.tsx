'use client'

import { useEffect } from 'react'

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
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (!newWorker) return
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            }
          })
        })
      })
      .catch(console.error)
  }, [])

  return null
}
