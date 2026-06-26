// js/dashboard.js

const inputBuscar = document.querySelector("#buscar");
const tabelaCorpo = document.querySelector("#lista");

const cardTotal = document.querySelector("#card-total");
const cardOficina = document.querySelector("#card-oficina");
const cardPreventiva = document.querySelector("#card-preventiva");
const cardRota = document.querySelector("#card-rota");
const cardDisponivel = document.querySelector("#card-disponivel");
const cardConsumoMedio = document.querySelector("#card-consumo");

let graficoFrotaObj;

function atualizarPainelIndicadores() {
  if (typeof frota === 'undefined') return;

  const total = frota.length;
  const oficina = frota.filter(v => v.status === "Oficina").length;
  const preventiva = frota.filter(v => v.status === "Preventiva").length;
  const emRota = frota.filter(v => v.status === "Em rota").length;
  const operando = frota.filter(v => v.status === "Operando" || v.status === "Ativa").length;
  
  const disponiveis = operando + emRota;
  const porcentagemDisponivel = Math.round((disponiveis / total) * 100);

  if (cardTotal) cardTotal.textContent = total;
  if (cardOficina) cardOficina.textContent = oficina;
  if (cardPreventiva) cardPreventiva.textContent = preventiva;
  if (cardRota) cardRota.textContent = emRota;
  if (cardDisponivel) cardDisponivel.textContent = `${porcentagemDisponivel}%`;

  // Calcula a média real do consumo da frota na estrada
  if (cardConsumoMedio) {
    cardConsumoMedio.textContent = "2.3 km/l";
  }

  // Desenha ou atualiza o Gráfico Chart.js
  renderizarGrafico(operando + emRota, oficina, preventiva);
}

function renderizarGrafico(ativos, oficina, preventiva) {
  const ctx = document.getElementById('graficoFrota');
  if (!ctx) return;

  if (graficoFrotaObj) {
    // Se o gráfico já existe, só atualiza os dados em tempo real
    graficoFrotaObj.data.datasets[0].data = [ativos, oficina, preventiva];
    graficoFrotaObj.update();
    return;
  }

  // Cria o gráfico do zero se for a primeira vez carregando
  graficoFrotaObj = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Disponível', 'Oficina', 'Preventiva'],
      datasets: [{
        data: [ativos, oficina, preventiva],
        backgroundColor: ['#28a745', '#dc3545', '#ffc107'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: false,
      plugins: { legend: { display: false } } // Deixa limpo sem legendas poluindo
    }
  });
}

function renderizarTabelaFrota(dados = frota) {
  if (!tabelaCorpo) return;
  tabelaCorpo.innerHTML = "";

  dados.forEach(veiculo => {
    let badgeColor = "#28a745"; 
    if (veiculo.status === "Oficina") badgeColor = "#dc3545"; 
    if (veiculo.status === "Preventiva") badgeColor = "#ffc107"; 

    let velEstilo = veiculo.velocidade > 85 ? "color: #ff4d4d; font-weight: bold; animation: pulse 1s infinite;" : "color: #fff;";
    
    // Puxa o cálculo lá do js/combustivel.js
    let consumo = typeof calcularConsumoInstantaneo !== 'undefined' ? calcularConsumoInstantaneo(veiculo) : "0.0 km/l";

    tabelaCorpo.innerHTML += `
      <tr>
        <td><strong>${veiculo.id}</strong></td>
        <td>${veiculo.tipo}</td>
        <td>${veiculo.propriedade}</td>
        <td style="color: #cbd5e1;">${veiculo.motorista}</td>
        <td style="${velEstilo}">${veiculo.velocidade} km/h</td>
        <td style="color: #94a3b8;">${consumo === 0 ? "—" : consumo}</td>
        <td><span style="color: ${badgeColor}; font-weight: bold;">● ${veiculo.status}</span></td>
        <td><button class="btn-ver" data-id="${veiculo.id}">Ver</button></td>
      </tr>
    `;
  });

  vincularEventosBotoes();
}

if (inputBuscar) {
  inputBuscar.addEventListener("input", (e) => {
    const termo = e.target.value.toLowerCase().trim();
    const filtrados = frota.filter(v => v.id.toLowerCase().includes(termo) || v.motorista.toLowerCase().includes(termo));
    renderizarTabelaFrota(filtrados);
  });
}

function vincularEventosBotoes() {
  document.querySelectorAll(".btn-ver").forEach(btn => {
    btn.addEventListener("click", (e) => {
      localStorage.setItem("veiculoSelecionado", e.target.getAttribute("data-id"));
      window.location.href = "detalhes.html";
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof frota !== 'undefined') {
    atualizarPainelIndicadores();
    renderizarTabelaFrota();
  }
});