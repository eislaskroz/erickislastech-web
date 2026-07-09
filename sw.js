const CACHE_VERSION = "eit-v9-visual-premium-20260703";
const APP_SHELL = [
  "/",
  "/index.html",
  "/offline.html",
  "/pages/privacidad.html",
  "/css/reset.css",
  "/css/style.css",
  "/css/responsive.css",
  "/components/header.html",
  "/components/footer.html",
  "/js/components.js",
  "/js/script.js",
  "/js/analytics.js",
  "/js/noticias.js",
  "/js/tutoriales.js",
  "/data/noticias.json",
  "/data/tutoriales.json",
  "/assets/seo/site.webmanifest",
  "/assets/seo/favicon-32x32.png",
  "/assets/seo/android-chrome-192x192.png",
  "/assets/seo/android-chrome-512x512.png",
  "/assets/images/logos/logo-erick-islas-tech.webp",
  "/pages/resenas.html",
  "/pages/noticias.html",
  "/pages/tutoriales.html",
  "/pages/comunidad.html",
  "/pages/servicios.html",
  "/pages/contacto.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const request = event.request;
  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("/offline.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});
