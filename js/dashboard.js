// js/dashboard.js

const inputBuscar = document.querySelector("#buscar");
const tabelaCorpo = document.querySelector("#lista");

// Mapeamento dos Novos Indicadores da Imagem de Referência
const cardTotal = document.querySelector("#card-total");
const cardOficina = document.querySelector("#card-oficina");
const cardPreventiva = document.querySelector("#card-preventiva");
const cardRota = document.querySelector("#card-rota");
const cardDisponivel = document.querySelector("#card-disponivel");

// Elementos das Novas Métricas da Horizonte
const cardEntregas = document.querySelector("#card-entregas");
const cardAtrasos = document.querySelector("#card-atrasos");
const cardConsumoLitros = document.querySelector("#card-consumo-litros");
const cardEmissoes = document.querySelector("#card-emissoes");

let graficoFrotaObj;

// 1. Calcula todas as métricas em tempo real baseadas no js/frota.js
function atualizarPainelIndicadores() {
  if (typeof frota === 'undefined') return;

  // Contagem Geral para a Frota de Rua (Excluindo Empilhadeiras do cálculo de rota)
  const totalVeiculosRua = frota.filter(v => v.tipo !== "Empilhadeira").length; // 68 veículos
  const totalGeral = frota.length; // 72 veículos no total

  const oficina = frota.filter(v => v.status === "Oficina").length;
  const preventiva = frota.filter(v => v.status === "Preventiva").length;
  const emRota = frota.filter(v => v.status === "Em rota").length;
  const noPatio = frota.filter(v => v.status === "No Pátio").length;

  // Disponibilidade Real (Quem não está parado na manutenção)
  const disponiveis = totalGeral - (oficina + preventiva);
  const porcentagemDisponivel = Math.round((disponiveis / totalGeral) * 100);

  // Cálculos Logísticos Avançados (Simulados dinamicamente com base na atividade da frota)
  const totalEntregasConcluidas = frota.reduce((acc, v) => acc + (v.entregasHoje || 0), 0);
  const totalAtrasos = frota.filter(v => v.atrasado === true).length;
  
  // Combustível total consumido no dia (litros acumulados) e emissões de CO2 equivalentes
  const litrosConsumidos = 1280 + (emRota * 2); 
  const kgEmissoes = Math.round(litrosConsumidos * 2.0625); // Cálculo baseado em pegada de carbono diesel

  // Injeção segura dos dados nos Cards do HTML
  if (cardTotal) cardTotal.textContent = `${disponiveis} / ${totalGeral}`;
  if (cardOficina) cardOficina.textContent = oficina;
  if (cardPreventiva) cardPreventiva.textContent = preventiva;
  if (cardRota) cardRota.textContent = emRota;
  if (cardDisponivel) cardDisponivel.textContent = `${porcentagemDisponivel}%`;
  
  // Atualização dos novos cards logísticos
  if (cardEntregas) cardEntregas.textContent = `${totalEntregasConcluidas} CONCLUÍDAS`;
  if (cardAtrasos) cardAtrasos.textContent = `${totalAtrasos} EM ATRASO`;
  if (cardConsumoLitros) cardConsumoLitros.textContent = `${litrosConsumidos.toLocaleString('pt-BR')} L`;
  if (cardEmissoes) cardEmissoes.textContent = `${kgEmissoes.toLocaleString('pt-BR')} kg`;

  // Atualiza o Gráfico de Rosquinha do Painel
  renderizarGrafico(emRota + noPatio, oficina, preventiva);
}

// 2. Desenha ou Atualiza o Gráfico Operacional (Chart.js)
function renderizarGrafico(ativos, oficina, preventiva) {
  const ctx = document.getElementById('graficoFrota');
  if (!ctx) return;

  if (graficoFrotaObj) {
    graficoFrotaObj.data.datasets[0].data = [ativos, oficina, preventiva];
    graficoFrotaObj.update();
    return;
  }

  graficoFrotaObj = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Operando', 'Oficina', 'Preventiva'],
      datasets: [{
        data: [ativos, oficina, preventiva],
        backgroundColor: ['#28a745', '#dc3545', '#ffc107'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: false,
      plugins: { legend: { display: false } }
    }
  });
}

// 3. Renderiza a tabela operacional na tela com as novas colunas corporativas

// Adicione esta função dentro do seu js/dashboard.js para renderizar o gráfico de colunas azul
function renderizarGraficoBarrasBaia() {
  const ctx = document.getElementById('graficoCaminhoes');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['10 BAIAS', '8 BAIAS', '6 BAIAS', '6 BAIAS', '4 BAIAS'],
      datasets: [{
        data: [12, 15, 14, 14, 9],
        backgroundColor: '#00c0ff',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { grid: { color: '#142850' }, ticks: { color: '#64748b' } },
        x: { ticks: { color: '#64748b' } }
      },
      plugins: { legend: { display: false } }
    }
  });
}

// Chame a função renderizarGraficoBarrasBaia() dentro do seu evento DOMContentLoaded!
function renderizarTabelaFrota(dados = frota) {
  if (!tabelaCorpo) return;
  tabelaCorpo.innerHTML = "";

  if (dados.length === 0) {
    tabelaCorpo.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:20px; color:#888;">Nenhum registro localizado na base Horizonte.</td></tr>`;
    return;
  }

  dados.forEach(veiculo => {
    let badgeColor = "#28a745"; // Verde padrão para operação ativa
    if (veiculo.status === "Oficina") badgeColor = "#dc3545"; // Vermelho
    if (veiculo.status === "Preventiva") badgeColor = "#ffc107"; // Amarelo
    if (veiculo.status === "No Pátio") badgeColor = "#007bff"; // Azul exclusivo para pátio (Empilhadeiras)

    // Estilização condicional se houver excesso de velocidade ou atraso operacional
    let velEstilo = veiculo.velocidade > 85 ? "color: #ff4d4d; font-weight: bold;" : "color: #fff;";
    let linhaEstilo = veiculo.atrasado ? "background-color: rgba(220, 53, 69, 0.05);" : "";

    let consumo = typeof calcularConsumoInstantaneo !== 'undefined' ? calcularConsumoInstantaneo(veiculo) : "—";

    tabelaCorpo.innerHTML += `
      <tr style="${linhaEstilo}">
        <td><strong>${veiculo.id}</strong></td>
        <td><span class="tag-tipo">${veiculo.tipo}</span></td>
        <td><small style="color: #94a3b8;">${veiculo.modelo}</small></td>
        <td style="color: #cbd5e1;">${veiculo.motorista}</td>
        <td style="${velEstilo}">${veiculo.velocidade} km/h</td>
        <td style="color: #add8e6;">${consumo === 0 ? "—" : consumo}</td>
        <td><span style="color: ${badgeColor}; font-weight: bold;">● ${veiculo.status} ${veiculo.atrasado ? '(Atrasado)' : ''}</span></td>
        <td><button class="btn-ver" data-id="${veiculo.id}">Ver</button></td>
      </tr>
    `;
  });

  vincularEventosBotoes();
}

// 4. Input de busca inteligente que varre múltiplos campos da Frota Horizonte
if (inputBuscar) {
  inputBuscar.addEventListener("input", (e) => {
    const termo = e.target.value.toLowerCase().trim();
    const filtrados = frota.filter(v => 
      v.id.toLowerCase().includes(termo) || 
      v.motorista.toLowerCase().includes(termo) ||
      v.tipo.toLowerCase().includes(termo) ||
      v.destino.toLowerCase().includes(termo)
    );
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