/**
 * Algorithm 6 — Offline PWA Verification
 * Runs in the browser (not Node) as a Service Worker. Caches the core
 * verification UI so a store associate can still authenticate a product
 * during a network outage. Register this from your front-end with:
 *   navigator.serviceWorker.register('/service-worker.js')
 */

const CACHE_NAME = 'securetag-v1';

const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
