/*service-worker.js*/

const CACHE_NAME = 'horizonte-cache-v2';

const ARQUIVOS_PARA_CACHE = [
  '/',
  '/index.html',
  '/pages/dashboard.html',
  '/pages/mapa.html',
  '/pages/detalhes.html',
  '/pages/login.html',
  '/css/style.css',
  '/css/sidebar.css',
  '/css/dashboard.css',
  '/css/mapa.css',
  '/css/login.css',
  '/js/frota.js',
  '/js/dashboard.js',
  '/js/mapa.js',
  '/js/detalhes.js',
  '/js/pwa.js',
  '/js/auth.js',
  '/manifest.json'
];


self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ARQUIVOS_PARA_CACHE);
    })
  );
  self.skipWaiting(); 
});


self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys().then((chaves) => {
      return Promise.all(
        chaves.map((cache) => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      );
    })
  );
});


self.addEventListener('fetch', (evento) => {
  evento.respondWith(
    caches.match(evento.request).then((resposta) => {
      return resposta || fetch(evento.request).catch(() => {
       
        console.warn('Recurso offline indisponível:', evento.request.url);
      });
    })
  );
});