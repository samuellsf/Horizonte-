// service-worker.js
const CACHE_NAME = 'frota-horizonte-cache-v1';

// Lista de arquivos que o PWA vai salvar para abrir mesmo sem internet
const ARQUIVOS_PARA_CACHE = [
  './pages/dashboard.html',
  './pages/mapa.html',
  './pages/detalhes.html',
  './pages/login.html',
  './css/style.css',
  './css/sidebar.css',
  './css/dashboard.css',
  './css/mapa.css',
  './css/login.css',
  './js/frota.js',
  './js/dashboard.js',
  './js/mapa.js',
  './js/detalhes.js',
  './js/pwa.js',
  './js/auth.js',
  './manifest.json'
];

// 1. Instalação: Salva os arquivos essenciais no cache do navegador
self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Armazenando arquivos no cache...');
      return cache.addAll(ARQUIVOS_PARA_CACHE);
    })
  );
});

// 2. Ativação: Limpa caches antigos se você atualizar o sistema
self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys().then((chavesDoCache) => {
      return Promise.all(
        chavesDoCache.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Limpando cache antigo...', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. Interceptação: Se o usuário ficar sem internet, o app busca do cache local
self.addEventListener('fetch', (evento) => {
  evento.respondWith(
    caches.match(evento.request).then((respostaEncontrada) => {
      // Retorna o arquivo do cache se houver, ou faz a requisição normal na rede
      return respostaEncontrada || fetch(evento.request);
    }).catch(() => {
      // Caso a rede falhe e o arquivo não esteja no cache (página de segurança offline)
      console.log('O usuário está offline e o recurso não foi cacheado.');
    })
  );
});