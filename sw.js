const CACHE_NAME = 'string-atlas-v8.10.2';

const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './styles/main.css',
  './styles/themes.css',
  './styles/mobile.css',
  './assets/icons/icon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/apple-touch-icon.png',
  './js/main.js',
  './js/state/store.js',
  './js/core/theory24.js',
  './js/core/database.js',
  './js/core/i18n.js',
  './js/core/themes.js',
  './js/core/themeGraphics.js',
  './js/core/customTunings.js',
  './js/core/fretClarity.js',
  './js/core/tensionEngine.js',
  './js/core/voicingEngine.js',
  './js/core/etudeGenerator.js',
  './js/core/vampEngine.js',
  './js/core/modulationRadar.js',
  './js/core/earTrainer.js',
  './js/core/exportEngine.js',
  './js/core/plateExporter.js',
  './js/core/scalaEngine.js',
  './js/core/sessionCodec.js',
  './js/core/studyGuide.js',
  './js/core/studyDossiers.js',
  './js/core/glossary.js',
  './js/audio/mobileAudioGuard.js',
  './js/audio/synthEngine.js',
  './js/audio/rhythmEngine.js',
  './js/audio/pitchDetector.js',
  './js/views/fretboardView.js',
  './js/views/deckPanelsView.js',
  './js/views/notationView.js',
  './js/views/themeDrawerView.js',
  './js/views/headerMenuView.js',
  './js/views/toastView.js',
  './js/views/radarView.js',
  './js/views/scalaView.js',
  './js/views/mobileNavView.js',
  './js/views/vampView.js',
  './js/views/earLabView.js',
  './js/views/snapshotsView.js',
  './js/views/commandPaletteView.js',
  './js/views/studyGuideView.js',
  './js/views/glossaryView.js',
  './js/views/lineModeView.js',
  './js/views/harmonyView.js',
  './js/views/etudeView.js',
  './js/views/rhythmView.js',
  './js/views/tensionView.js',
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
