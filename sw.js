'use strict';

// Fully offline static runtime. The app must not depend on a live network once
// the shell and question assets have been installed into the service-worker cache.
const CACHE_NAME = 'azaman-bluebook-v2';
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
      .then((names) => Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  // Cache-first: runtime behavior is deterministic and offline-capable. A
  // network request is only used as a recovery path for assets that were not
  // present in the install cache, never as the primary source for the exam UI.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
        }
        return response;
      }).catch(() => caches.match('index.html'));
    })
  );
});
