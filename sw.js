'use strict';

// The exam model is intentionally self-contained. Every runtime asset needed
// by the browser is precached during installation; after installation the
// service worker never reaches the network.
const CACHE_NAME = 'azaman-bluebook-v8';
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
  'bluebook-fidelity-overrides.css',
  'bluebook-fidelity-refinements.css',
  'bluebook-exam-mode.css',
  'bluebook-exam-finalization.css',
  'bluebook-break-fidelity.css',
  'bluebook-pixel-fidelity.css',
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
  'bluebook-fidelity-enhancement.js',
  'bluebook-fidelity-refinements.js',
  'bluebook-exam-mode.js',
  'bluebook-exam-finalization.js',
  'bluebook-module-transition.js',
  'bluebook-break-fidelity.js',
  'bluebook-mvp-runtime.js',
  'favicon.svg',
  'manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.all(PRECACHE_URLS.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      // No network fallback by design. Navigation falls back to the cached
      // application shell; an unknown static asset gets a clear offline 404.
      if (request.mode === 'navigate') return caches.match('./index.html');
      return new Response('Offline asset unavailable', {
        status: 503,
        statusText: 'Offline asset unavailable',
        headers: {'Content-Type': 'text/plain; charset=utf-8'}
      });
    })
  );
});
