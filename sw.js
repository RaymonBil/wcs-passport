// Service worker mínimo: precache del shell y estrategia network-first con fallback a caché (modo offline).
const CACHE = "wcs-passport-v1";
// Rutas relativas al scope del worker, para funcionar también bajo un subdirectorio (GitHub Pages).
const BASE = new URL(self.registration.scope).pathname;
const SHELL = [BASE, `${BASE}icon.svg`, `${BASE}manifest.webmanifest`];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(request, copy));
        return res;
      })
      .catch(() => caches.match(request).then((r) => r || caches.match(BASE)))
  );
});
