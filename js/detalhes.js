/*detalhes.js*/

const DetalhesService = {
   
    init() {
        document.addEventListener("DOMContentLoaded", () => {
            const idSelecionado = localStorage.getItem("veiculoSelecionado") || "CAM-1";
            this.carregarDetalhes(idSelecionado);
        });
    },

    carregarDetalhes(id) {
        const veiculo = typeof frota !== 'undefined' ? frota.find(v => v.id === id) : null;
        
        if (!veiculo) {
            console.warn("Veículo não encontrado:", id);
            return;
        }

        this.renderizar(veiculo);
    },

    renderizar(veiculo) {
        const elementos = {
            id: document.querySelector("#veiculo-id"),
            tipo: document.querySelector("#veiculo-tipo"),
            km: document.querySelector("#veiculo-km"),
            combustivel: document.querySelector("#veiculo-combustivel"),
            motor: document.querySelector("#veiculo-motor"),
            revisao: document.querySelector("#veiculo-revisao"),
            localizacao: document.querySelector("#veiculo-localizacao")
        };

        if (elementos.id) elementos.id.textContent = veiculo.id;
        if (elementos.tipo) elementos.tipo.textContent = veiculo.tipo;
        
     
        if (elementos.km) {
            elementos.km.textContent = veiculo.tipo === "Empilhadeira" 
                ? "N/A (Horas: 1.240h)" 
                : `${(500000 + (parseInt(veiculo.id.split('-')[1]) * 123)).toLocaleString('pt-BR')} km`;
        }

        if (elementos.combustivel) elementos.combustivel.textContent = `${Math.floor(Math.random() * (100 - 20) + 20)}%`;
        if (elementos.motor) elementos.motor.textContent = veiculo.tipo === "Empilhadeira" ? "Elétrica" : "520cv";
        if (elementos.revisao) elementos.revisao.textContent = "15/06/2026";
        
        if (elementos.localizacao) {
            elementos.localizacao.textContent = this.traduzirLocalizacao(veiculo.status);
        }
    },

   
    traduzirLocalizacao(status) {
        const mapaStatus = {
            "Oficina": "Oficina Central",
            "Em Oficina": "Oficina Central",
            "Rota": "Em Rota",
            "Em Rota": "Em Rota",
            "Pátio": "No Pátio",
            "Patio": "No Pátio",
            "Concluído": "Concluído"
        };
        return mapaStatus[status] || status;
    }
};


DetalhesService.init();