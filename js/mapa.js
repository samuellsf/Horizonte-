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

        setTimeout(() => {
            this.mapa.invalidateSize();
        }, 200);

        console.log("Mapa inicializado com sucesso.");
    },

    renderizarVeiculos(listaVeiculos) {
        if (!this.grupoMarcadores) return;

        this.grupoMarcadores.clearLayers();

        listaVeiculos.forEach(veiculo => {
            const [lat, lng] = this._gerarCoordenadasAleatorias();

            veiculo.lat = lat;
            veiculo.lng = lng;

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
        const statusIcon =
            (veiculo.status === "Em Rota" || veiculo.status === "Operando")
                ? "🟢"
                : "🔴";

        return `
            <div class="popup-veiculo">
                <h3>${veiculo.id}</h3>
                <p><strong>Status:</strong> ${statusIcon} ${veiculo.status}</p>
                <button onclick="MapaService.verDetalhes('${veiculo.id}')">
                    Ver Detalhes
                </button>
            </div>
        `;
    },

    verDetalhes(idVeiculo) {
        localStorage.setItem("veiculoSelecionado", idVeiculo);
        window.location.href = "detalhes.html";
    },

    filtrarPorStatus(status) {
        if (!this.grupoMarcadores) return;

        this.grupoMarcadores.clearLayers();

        const filtrados = frota.filter(v => v.status === status);

        const bounds = [];

        filtrados.forEach(veiculo => {
            const [lat, lng] = this._gerarCoordenadasAleatorias();

            veiculo.lat = lat;
            veiculo.lng = lng;

            const marcador = L.marker([lat, lng]).addTo(this.grupoMarcadores);

            marcador.bindPopup(this._criarTemplatePopup(veiculo));

            bounds.push([lat, lng]);
        });

        if (bounds.length > 0) {
            this.mapa.fitBounds(bounds, {
                padding: [50, 50]
            });
        }
    }
};


document.addEventListener("DOMContentLoaded", () => {
    MapaService.init("mapa-container");

    if (typeof frota !== "undefined") {
        MapaService.renderizarVeiculos(frota);
    }

    const filtro = localStorage.getItem("filtroStatus");

    if (filtro) {
        setTimeout(() => {
            MapaService.filtrarPorStatus(filtro);
        }, 300);

        localStorage.removeItem("filtroStatus");
    }
});


window.addEventListener("resize", () => {
    if (MapaService.mapa) {
        MapaService.mapa.invalidateSize();
    }
});