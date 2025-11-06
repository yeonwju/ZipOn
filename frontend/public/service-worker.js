const SW_VERSION = 'v1.0.3'
const PRECACHE = `precache-${SW_VERSION}`
const RUNTIME = `runtime-${SW_VERSION}`

const STATIC_ASSETS = ['/icons/zipon.png']

// 백 개발 이후 수정 예정
const NO_CACHE_PATHS = ['/api/auth', '/api/payment', '/api/account']
function isNoCache(url) {
  const { pathname } = new URL(url, self.location.origin)
  return NO_CACHE_PATHS.some(p => pathname.startsWith(p))
}

async function safePrecache(cache, urls) {
  const results = await Promise.allSettled(
    urls.map(async url => {
      const res = await fetch(url, { cache: 'no-cache' })
      if (!res.ok) throw new Error(`${url} ${res.status}`)
      await cache.put(url, res.clone())
    })
  )
  const failed = results.filter(r => r.status === 'rejected')
  if (failed.length) {
    console.warn(
      '[SW] precache skipped:',
      failed.map(f => f.reason?.message)
    )
  }
}

self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PRECACHE)
      await safePrecache(cache, STATIC_ASSETS)
    })()
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys.filter(k => ![PRECACHE, RUNTIME].includes(k)).map(k => caches.delete(k))
      )

      if ('navigationPreload' in self.registration) {
        try {
          await self.registration.navigationPreload.enable()
        } catch {}
      }

      try {
        const res = await fetch('/offline', { cache: 'no-cache' })
        if (res.ok) {
          const cache = await caches.open(PRECACHE)
          await cache.put('/offline', res.clone())
        }
      } catch {}

      await self.clients.claim()
    })()
  )
})

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.addEventListener('fetch', event => {
  const req = event.request

  if (isNoCache(req.url)) return

  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const preload = await event.preloadResponse
          if (preload) return preload

          const net = await fetch(req)
          const cache = await caches.open(RUNTIME)
          cache.put(req, net.clone())
          return net
        } catch {
          // 캐시된 페이지가 있으면 우선
          const cached = await caches.match(req)
          if (cached) return cached
          // /offline 페이지가 캐시에 있으면 fallback
          const offline = await caches.match('/offline')
          if (offline) return offline
          return new Response('오프라인입니다.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          })
        }
      })()
    )
    return
  }

  // 정적: Stale-While-Revalidate
  const dest = req.destination
  if (['image', 'font', 'style', 'script'].includes(dest)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(RUNTIME)
        const cached = await cache.match(req)
        const fetching = fetch(req)
          .then(res => {
            cache.put(req, res.clone())
            return res
          })
          .catch(() => undefined)
        return cached || fetching || fetch(req)
      })()
    )
  }
})
