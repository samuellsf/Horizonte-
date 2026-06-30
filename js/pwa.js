/*pwa.js*/

const PwaService = {
    
    registrar() {
        if (!('serviceWorker' in navigator)) {
            console.warn('PWA: Service Worker não é suportado neste navegador.');
            return;
        }

        window.addEventListener('load', () => {
            
            navigator.serviceWorker.register('../service-worker.js')
                .then(registro => {
                    console.log('PWA: Service Worker registrado com sucesso!', registro.scope);
                })
                .catch(erro => {
                    console.error('PWA: Falha ao registrar o Service Worker:', erro);
                });
        });
    }
};


PwaService.registrar();