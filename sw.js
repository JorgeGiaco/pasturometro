// Service worker: cachea la app para que funcione sin señal en el campo.
const CACHE = 'pasturometro-v3';
const FILES = ['./', './index.html', './manual.html', './aruco.js', './manifest.json',
  './icon-192.png', './icon-512.png', './marcadores_plato.pdf', './curvas.json'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin || e.request.method !== 'GET') return;  // deja pasar la API de GitHub
  if (url.pathname.endsWith('curvas.json')) {
    // las curvas de referencia: primero la red, y si no hay senal, la copia guardada
    e.respondWith(fetch(e.request).then(r => {
      const copia = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copia));
      return r;
    }).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
