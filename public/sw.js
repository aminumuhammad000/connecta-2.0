// Connecta Progressive Web App Service Worker
const CACHE_NAME = 'connecta-pwa-v1.2'
const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-maskable-192x192.png',
  '/icons/apple-touch-icon.png',
  '/favicon.ico',
]

// Install event: cache core shell & offline fallback
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Precache non-critical item failed:', err)
      })
    })
  )
  self.skipWaiting()
})

// Activate event: cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Only handle GET requests and http/https schemes
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return
  }

  // Never cache or intercept dynamic API routes or auth endpoints
  if (url.pathname.startsWith('/api/')) {
    return
  }

  // Handle page navigations (HTML documents)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If response is valid, optionally update cache in background
          if (response && response.status === 200) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(async () => {
          // Try to serve from cache first
          const cachedResponse = await caches.match(request)
          if (cachedResponse) {
            return cachedResponse
          }
          // Fallback to offline page
          const offlinePage = await caches.match('/offline.html')
          return offlinePage || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } })
        })
    )
    return
  }

  // Handle static assets (images, fonts, scripts, css) with stale-while-revalidate
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/brand/') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.woff2')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone()
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, clone)
              })
            }
            return networkResponse
          })
          .catch(() => cached)

        return cached || fetchPromise
      })
    )
    return
  }

  // Default network fetch with cache fallback
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  )
})
