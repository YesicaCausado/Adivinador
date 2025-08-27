const CACHE_NAME = 'adivina-cancion-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn-icons-png.flaticon.com/128/3408/3408796.png',
  'https://www.youtube.com/iframe_api'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.log('❌ Error al cachear:', error);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devolver desde cache si existe
        if (response) {
          return response;
        }
        // Si no, hacer fetch normal
        return fetch(event.request);
      })
      .catch(() => {
        // Fallback para cuando no hay conexión
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
