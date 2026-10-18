// Service worker: guarda todas las páginas de la guía para usarla sin conexión.
// HTML: red primero y caché como respaldo. Recursos estáticos (_next, iconos, mapas): caché primero.
const VERSION = "wcs-passport-v2";
const BASE = new URL(self.registration.scope).pathname;

self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(VERSION);
      try {
        const routes = await (await fetch(`${BASE}precache.json`, { cache: "no-store" })).json();
        const urls = [...routes.map((r) => `${BASE}${r}`), `${BASE}icon.svg`, `${BASE}manifest.webmanifest`, `${BASE}calendario.ics`];
        // Una página que falle no debe impedir la instalación del resto.
        await Promise.all(urls.map((u) => cache.add(u).catch(() => {})));
      } catch {}
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

const isStatic = (url) =>
  url.pathname.includes("/_next/static/") || /\.(svg|png|jpg|webp|woff2?|css|js)$/.test(url.pathname) || url.hostname.endsWith("tile.openstreetmap.org");

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;
  if (!sameOrigin && !url.hostname.endsWith("tile.openstreetmap.org")) return;

  if (isStatic(url)) {
    e.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            if (res.ok || res.type === "opaque") {
              const copy = res.clone();
              caches.open(VERSION).then((c) => c.put(request, copy));
            }
            return res;
          })
      )
    );
    return;
  }

  e.respondWith(
    fetch(request)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(request, copy));
        }
        return res;
      })
      .catch(async () => (await caches.match(request)) || (await caches.match(`${BASE}`)) || Response.error())
  );
});
