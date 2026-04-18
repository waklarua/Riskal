// Service Worker for Riskal PWA
const CACHE_NAME = "riskal-v4"
const STATIC_ASSETS = ["/manifest.json", "/icon-192x192.jpg", "/icon-512x512.jpg"]

// Install event - cache static assets only (not HTML pages)
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    }),
  )
  self.skipWaiting()
})

// Activate event - clean up old caches immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  return self.clients.claim()
})

// Fetch event - network-first for navigation, cache-first for static assets
self.addEventListener("fetch", (event) => {
  const { request } = event

  // Navigation requests (HTML pages): always go to network first
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => {
        // Offline fallback: try cache
        return caches.match(request)
      }),
    )
    return
  }

  // Static assets: cache-first with network fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }
      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response
        }
        const responseToCache = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache)
        })
        return response
      })
    }),
  )
})
