'use strict';
// Offline support: this is a fully static, no-backend practice app — once
// loaded once with a connection, it should keep working with none at all.
// Strategy is network-first (so normal online use always gets the latest
// files) with a cache fallback for when the network is unavailable.
const CACHE_NAME = 'azaman-bluebook-v1';
const PRECACHE_URLS = [
  './',
  'index.html',
  'styles.css?v=3af',
  'styles-tokens.css?v=3af',
  'reference-pan.css',
  'media-enhancement.css',
  'tools-move-enhancement.css',
  'line-reader-enhancement.css',
  'results-domain-report.css',
  'results-question-review.css',
  'results-choice-breakdown.css',
  'data/questions.js',
  'data/rw2-easy.js',
  'data/rw-source-overrides.js',
  'data/question-quality-overrides.js',
  'data/media-overrides.js',
  'session-guard.js',
  'exam-ui-sanitizer.js',
  'app.js',
  'room-code-enhancement.js',
  'keyboard.js',
  'spr-input.js',
  'tools-enhancement.js',
  'note-enhancement.js',
  'modal-enhancement.js',
  'calculator-enhancement.js',
  'code-input-enhancement.js',
  'results-enhancement.js',
  'results-download-enhancement.js',
  'results-choice-breakdown-enhancement.js',
  'ui-accessibility-enhancement.js',
  'media-enhancement.js',
  'tools-move-enhancement.js',
  'media-touch-enhancement.js',
  'line-reader-enhancement.js',
  'reference-keyboard-enhancement.js',
  'unscheduled-break-enhancement.js',
  'favicon.svg',
  'manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.all(PRECACHE_URLS.map((url) => cache.add(url).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(req).then((cached) => cached || caches.match('index.html')))
  );
});
