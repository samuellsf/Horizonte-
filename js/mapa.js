// js/mapa.js

// 1. Configuração inicial do Mapa (Centralizado no Brasil por padrão)
let mapa;
const centroBrasil = [-15.7801, -47.9292]; 

function inicializarMapa() {
  // Procura uma div com id="mapa-container" no HTML
  const container = document.querySelector("#mapa-container");
  if (!container) return;

  // Cria o mapa usando a biblioteca Leaflet (L)
  mapa = L.map('mapa-container').setView(centroBrasil, 4);

  // Adiciona as imagens/camadas do mapa (OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapa);

  // Plota os veículos se a frota existir
  if (typeof frota !== 'undefined' && frota.length > 0) {
    plotarVeiculosNoMapa();
  }
}

// 2. Função para gerar coordenadas falsas ao redor do centro para simulação
function gerarCoordenadasAleatorias(baseLat, baseLng, variacao = 8) {
  const lat = baseLat + (Math.random() - 0.5) * variacao;
  const lng = baseLng + (Math.random() - 0.5) * variacao;
  return [lat, lng];
}

// 3. Coloca os pins (marcadores) de cada caminhão e empilhadeira no mapa
function plotarVeiculosNoMapa() {
  frota.forEach(veiculo => {
    // Gera um ponto no mapa para o veículo
    const [lat, lng] = gerarCoordenadasAleatorias(centroBrasil[0], centroBrasil[1]);

    // Define a cor do pin ou texto com base no status do veículo
    const corStatus = veiculo.status === "Operando" || veiculo.status === "Ativa" ? "🟢" : "🔴";

    // Cria o marcador no mapa
    const marcador = L.marker([lat, lng]).addTo(mapa);

    // Cria a caixinha de texto (Popup) que aparece ao clicar no marcador
    marcador.bindPopup(`
      <div style="font-family: sans-serif; line-height: 1.4;">
        <h3 style="margin: 0 0 5px 0;">${veiculo.id}</h3>
        <p style="margin: 0;"><strong>Status:</strong> ${corStatus} ${veiculo.status}</p>
        <button onclick="verDetalhesMapa('${veiculo.id}')" style="margin-top: 8px; background: #007bff; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; width: 100%;">Ver Detalhes</button>
      </div>
    `);
  });
}

// 4. Ação do botão de detalhes dentro do balão do mapa
window.verDetalhesMapa = function(idVeiculo) {
  localStorage.setItem("veiculoSelecionado", idVeiculo);
  window.location.href = "detalhes.html";
};

// 5. Executa assim que a estrutura da página carregar
document.addEventListener("DOMContentLoaded", () => {
  inicializarMapa();
});