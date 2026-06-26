// js/pwa.js

// Verifica se o navegador suporta a tecnologia de Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Registra o arquivo do Service Worker que está na raiz do projeto
    navigator.serviceWorker.register('../service-worker.js')
      .then(registro => {
        console.log('PWA: Service Worker registrado com sucesso!', registro.scope);
      })
      .catch(erro => {
        console.error('PWA: Falha ao registrar o Service Worker:', erro);
      });
  });
}