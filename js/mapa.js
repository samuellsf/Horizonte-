/* mapa.js */

const MapaService = {
    mapa: null,
    grupoMarcadores: null,
    centroPadrao: [-15.7801, -47.9292],

    init(containerId) {
        const container = document.querySelector(`#${containerId}`);
        if (!container) return;

        this.mapa = L.map(containerId).setView(this.centroPadrao, 4);
        this.grupoMarcadores = L.layerGroup().addTo(this.mapa);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(this.mapa);

        console.log("Mapa inicializado com sucesso.");
    },

    renderizarVeiculos(listaVeiculos) {
        if (!this.grupoMarcadores) return;
        
        this.grupoMarcadores.clearLayers(); 

        listaVeiculos.forEach(veiculo => {
            const [lat, lng] = this._gerarCoordenadasAleatorias();
            const marcador = L.marker([lat, lng]).addTo(this.grupoMarcadores);
            marcador.bindPopup(this._criarTemplatePopup(veiculo));
        });
    },

    _gerarCoordenadasAleatorias(variacao = 8) {
        const lat = this.centroPadrao[0] + (Math.random() - 0.5) * variacao;
        const lng = this.centroPadrao[1] + (Math.random() - 0.5) * variacao;
        return [lat, lng];
    },

    _criarTemplatePopup(veiculo) {
        const statusIcon = (veiculo.status === "Operando" || veiculo.status === "Ativa") ? "🟢" : "🔴";
        return `
            <div style="font-family: sans-serif; line-height: 1.4;">
                <h3 style="margin: 0 0 5px 0;">${veiculo.id}</h3>
                <p style="margin: 0;"><strong>Status:</strong> ${statusIcon} ${veiculo.status}</p>
                <button onclick="MapaService.verDetalhes('${veiculo.id}')" 
                        style="margin-top: 8px; background: #007bff; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; width: 100%;">
                    Ver Detalhes
                </button>
            </div>
        `;
    },

    verDetalhes(idVeiculo) {
        localStorage.setItem("veiculoSelecionado", idVeiculo);
        window.location.href = "detalhes.html";
    }
};

document.addEventListener("DOMContentLoaded", () => {
    MapaService.init("mapa-container");

    if (typeof frota !== 'undefined') {
        MapaService.renderizarVeiculos(frota);
    }
});