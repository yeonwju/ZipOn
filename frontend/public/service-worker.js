const SW_VERSION = 'v1.0.1'
const PRECACHE = `precache-${SW_VERSION}`
const RUNTIME_CACHE = `runtime-${SW_VERSION}`

// dev에선 public 정적만 프리캐시
const STATIC_ASSETS = ['/manifest.webmanifest', '/icons/zipon.png']

// 개별 안전 프리캐시
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
        keys.filter(k => ![PRECACHE, RUNTIME_CACHE].includes(k)).map(k => caches.delete(k))
      )
    })()
  )
})

self.addEventListener('fetch', event => {
  const req = event.request

  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const preload = await event.preloadResponse
          if (preload) return preload
          const netRes = await fetch(req)
          const cache = await caches.open(RUNTIME_CACHE)
          cache.put(req, netRes.clone())
          return netRes
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
  if (['image', 'font', 'style', 'script'].includes(req.destination)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(RUNTIME_CACHE)
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
