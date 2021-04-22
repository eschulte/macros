var cacheStorageKey = 'macros'

var cacheList = [
  // Mirroring the whole site caused problems trying to load fontawesome
  // "Origin Resource Sharing policy:
  //  Origin http://localhost:8080 is not allowed by Access-Control-Allow-Origin."
  //
  // '/macros/',
  '/macros/apple-touch-icon.png',
  '/macros/autocomplete.js',
  '/macros/favicon.ico',
  '/macros/foods.json',
  '/macros/icons-192.png',
  '/macros/icons-512.png',
  '/macros/index.html',
  '/macros/macros-ui.js',
  '/macros/macros.js',
  '/macros/manifest.json',
  '/macros/sw.js',
  '/macros/targets.json',
  '/macros/vega.min.js',
  '/macros/vega.min.js.map',
  '/macros/w3.css',
]

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheStorageKey).then(function(cache) {
      return cache.addAll(cacheList)
    }).then(function() {
      return self.skipWaiting()
    })
  )
})

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response != null) {
        return response
      }
      return fetch(e.request.url)
    })
  )
})
