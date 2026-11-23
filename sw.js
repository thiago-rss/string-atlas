const CACHE_NAME = 'string-atlas-v1.0.0';

const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './styles/main.css',
  './assets/icons/icon.svg',
  './js/main.js',
  './js/state/store.js',
  './js/core/theory24.js',
  './js/core/database.js',
  './js/core/i18n.js',
  './js/audio/synthEngine.js',
  './js/views/fretboardView.js',
  './js/views/deckPanelsView.js',
  './js/views/dossierView.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first when online (prevents stale JS during dev), falling back cleanly to cache offline
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((networkRes) => {
        if (networkRes && networkRes.status === 200 && networkRes.type === 'basic') {
          const copy = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return networkRes;
      })
      .catch(() => caches.match(event.request))
  );
});
