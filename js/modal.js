/*modal.js */

const ModalService = {

    element: document.getElementById("modal"),
    titulo: document.getElementById("modal-titulo"),
    status: document.getElementById("modal-status"),

    abrir(id, dadosFonte) {
        
        const veiculo = dadosFonte.find(x => x.id === id);
        
        if (!veiculo || !this.element) {
            console.error("Veículo não encontrado ou modal não configurado.");
            return;
        }

        this.titulo.innerHTML = veiculo.id;
        this.status.innerHTML = veiculo.status;


        this.element.style.display = "flex";
    },

    fechar() {
        if (this.element) {
            this.element.style.display = "none";
        }
    }
};
