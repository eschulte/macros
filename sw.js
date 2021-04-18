console.log('Script loaded!')
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
  console.log('Cache event!')
  e.waitUntil(
    caches.open(cacheStorageKey).then(function(cache) {
      console.log('Adding to Cache:', cacheList)
      return cache.addAll(cacheList)
    }).then(function() {
      console.log('Skip waiting!')
      return self.skipWaiting()
    })
  )
})

self.addEventListener('activate', function(e) {
  console.log('Activate event')
  e.waitUntil(
    Promise.all(
      caches.keys().then(cacheNames => {
        return cacheNames.map(name => {
          if (name !== cacheStorageKey) {
            return caches.delete(name)
          }
        })
      })
    ).then(() => {
      console.log('Clients claims.')
      return self.clients.claim()
    })
  )
})

self.addEventListener('fetch', function(e) {
  // console.log('Fetch event:', e.request.url)
  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response != null) {
        console.log('Using cache for:', e.request.url)
        return response
      }
      console.log('Fallback to fetch:', e.request.url)
      return fetch(e.request.url)
    })
  )
})
