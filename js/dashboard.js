// js/dashboard.js

const inputBuscar = document.querySelector("#buscar");
const tabelaCorpo = document.querySelector("#lista");

// Mapeamento dos Indicadores Superiores
const cardTotal = document.querySelector("#card-total");
const cardDisponivel = document.querySelector("#card-disponivel");

// Elementos das Métricas da Horizonte
const cardEntregas = document.querySelector("#card-entregas");
const cardAtrasos = document.querySelector("#card-atrasos");
const cardConsumoLitros = document.querySelector("#card-consumo-litros");
const cardEmissoes = document.querySelector("#card-emissoes");
const cardTotalDevolucoes = document.querySelector("#total-devolucoes");

let graficoFrotaObj;
let graficoCaminhoesObj;

// 🔧 NORMALIZADOR
function normalizarStatus(status) {
  return (status || "")
    .toString()
    .toLowerCase()
    .trim();
}

// ================================
// INDICADORES
// ================================
function atualizarPainelIndicadores() {
  if (typeof frota === "undefined") return;

  const totalGeral = frota.length;

  const oficina = frota.filter(v =>
    normalizarStatus(v.status).includes("oficina")
  ).length;

  const preventiva = frota.filter(v =>
    normalizarStatus(v.status).includes("preventiva")
  ).length;

  const emRota = frota.filter(v =>
    normalizarStatus(v.status).includes("rota")
  ).length;

  const noPatio = frota.filter(v =>
    normalizarStatus(v.status).includes("patio")
  ).length;

  const totalAtrasos = frota.filter(v =>
    normalizarStatus(v.status).includes("atras")
  ).length;

  const disponiveis = totalGeral - (oficina + preventiva);

  const porcentagemDisponivel = totalGeral
    ? Math.round((disponiveis / totalGeral) * 100)
    : 0;

  const totalEntregasConcluidas = frota.reduce((acc, v) =>
    acc + (Number(v.entregas) || 0), 0
  );

  const totalDevolucoesHoje = frota.reduce((acc, v) =>
    acc + (Number(v.devolucoes) || 0), 0
  );

  const litrosConsumidos = 1280 + (emRota * 2);
  const kgEmissoes = Math.round(litrosConsumidos * 2.0625);

  if (cardTotal)
    cardTotal.textContent = `${disponiveis} / ${totalGeral}`;

  if (cardDisponivel)
    cardDisponivel.textContent = `${porcentagemDisponivel}%`;

  if (cardEntregas)
    cardEntregas.textContent =
      totalEntregasConcluidas.toLocaleString("pt-BR");

  if (cardAtrasos)
    cardAtrasos.textContent = `${totalAtrasos} EM ATRASO`;

  if (cardConsumoLitros)
    cardConsumoLitros.textContent = `${litrosConsumidos} L`;

  if (cardEmissoes)
    cardEmissoes.textContent = `${kgEmissoes} kg`;

  if (cardTotalDevolucoes)
    cardTotalDevolucoes.textContent = totalDevolucoesHoje;

  renderizarGrafico(emRota + noPatio, oficina, preventiva);
}

// ================================
// GRÁFICO ROSQUINHA
// ================================
function renderizarGrafico(ativos, oficina, preventiva) {
  const ctx = document.getElementById("graficoFrota");
  if (!ctx) return;

  if (graficoFrotaObj) {
    graficoFrotaObj.data.datasets[0].data = [ativos, oficina, preventiva];
    graficoFrotaObj.update();
    return;
  }

  graficoFrotaObj = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Operando", "Oficina", "Preventiva"],
      datasets: [{
        data: [ativos, oficina, preventiva],
        backgroundColor: ["#28a745", "#dc3545", "#ffc107"],
        borderWidth: 0
      }]
    },
    options: {
      responsive: false,
      plugins: { legend: { display: false } }
    }
  });
}

// ================================
// GRÁFICO BARRAS
// ================================
function renderizarGraficoBarrasBaia() {
  const ctx = document.getElementById("graficoCaminhoes");
  if (!ctx) return;

  if (graficoCaminhoesObj) {
    graficoCaminhoesObj.destroy();
  }

  graficoCaminhoesObj = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["10 BAIAS", "8 BAIAS", "6 BAIAS", "6 BAIAS", "4 BAIAS"],
      datasets: [{
        label: "Caminhões",
        data: [12, 15, 14, 14, 9],
        backgroundColor: "#00c0ff",
        borderRadius: 4,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          grid: { color: "#142850" },
          ticks: { color: "#64748b", font: { size: 10 } }
        },
        x: {
          grid: { display: false },
          ticks: { color: "#64748b", font: { size: 9 } }
        }
      },
      plugins: { legend: { display: false } }
    }
  });
}

// ================================
// TABELA
// ================================
function renderizarTabelaFrota(dados = frota) {
  if (!tabelaCorpo) return;

  tabelaCorpo.innerHTML = "";

  if (!dados.length) {
    tabelaCorpo.innerHTML = `
      <tr>
        <td colspan="10" style="text-align:center; padding:20px; color:#888;">
          Nenhum registro localizado na base Horizonte.
        </td>
      </tr>`;
    return;
  }

  let linhas = "";

  dados.forEach(v => {
    const revisaoTexto = v.revisao || "N/A";
    const multasTexto = v.multas || "Nenhuma";
    const motivoTexto = v.motivoParada || "Sem observações";

    const classeRevisao =
      revisaoTexto.includes("REVISAR") ? "txt-red font-bold" : "txt-blue";

    const classeMulta =
      multasTexto !== "Nenhuma" ? "txt-red" : "txt-green";

    const status = normalizarStatus(v.status);

    let statusComMotivo = "";

    if (status.includes("rota")) {
      statusComMotivo = `<span style="color:#4ade80;">● Em Rota</span>`;

      if (Number(v.devolucoes) > 0) {
        statusComMotivo += `<br><small style="color:#f7a04a;">⚠️ ${v.devolucoes} Devolução: ${v.motivoDevolucao || ""}</small>`;
      }

    } else if (status.includes("oficina")) {
      statusComMotivo = `<span style="color:#ff4d4d;">● Oficina</span><br><small class="txt-gray">${motivoTexto}</small>`;

    } else if (status.includes("preventiva")) {
      statusComMotivo = `<span style="color:#ffc107;">● Preventiva</span><br><small class="txt-gray">${motivoTexto}</small>`;

    } else if (status.includes("conclu")) {
      statusComMotivo = `<span style="color:#22c55e;">● Concluído</span>`;

    } else if (status.includes("patio")) {
      statusComMotivo = `<span style="color:#38bdf8;">● Pátio</span>`;

    } else {
      statusComMotivo = `<span style="color:#38bdf8;">● ${v.status}</span>`;
    }

    linhas += `
      <tr>
        <td><strong>${v.id}</strong></td>
        <td><span class="tag-tipo">${v.tipo}</span></td>
        <td><small style="color:#94a3b8;">${v.modelo}</small></td>
        <td style="color:#cbd5e1;">${v.motorista}</td>
        <td style="${v.velocidade > 85 ? "color:#ff4d4d;font-weight:bold;" : "color:#fff;"}">
          ${v.velocidade} km/h
        </td>
        <td style="color:#add8e6;">${v.consumo || "—"}</td>
        <td class="${classeRevisao}">${revisaoTexto}</td>
        <td class="${classeMulta}">${multasTexto}</td>
        <td>${statusComMotivo}</td>
        <td><button class="btn-ver" data-id="${v.id}">Ver</button></td>
      </tr>
    `;
  });

  tabelaCorpo.innerHTML = linhas;
}

// ================================
// BUSCA
// ================================
if (inputBuscar) {
  inputBuscar.addEventListener("input", (e) => {
    const termo = e.target.value.toLowerCase().trim();

    if (!termo) return renderizarTabelaFrota(frota);

    const filtrados = frota.filter(v =>
      v.id?.toLowerCase().includes(termo) ||
      v.motorista?.toLowerCase().includes(termo) ||
      v.tipo?.toLowerCase().includes(termo) ||
      v.destino?.toLowerCase().includes(termo)
    );

    renderizarTabelaFrota(filtrados);
  });
}

// ================================
// BOTÃO VER (EVENT DELEGATION)
// ================================
if (tabelaCorpo) {
  tabelaCorpo.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-ver")) {
      localStorage.setItem("veiculoSelecionado", e.target.dataset.id);
      window.location.href = "detalhes.html";
    }
  });
}

// ================================
// EXPORTAÇÃO CSV
// ================================
const btnExportar = document.querySelector("#btn-exportar");

if (btnExportar) {
  btnExportar.addEventListener("click", () => {
    if (!frota?.length) return alert("Nenhum dado encontrado.");

    let csv =
      "ID;Tipo;Modelo;Motorista;Velocidade;Consumo;Revisao;Multas;Status;Destino;Motivo;Devolucoes\n";

    frota.forEach(v => {
      csv += `${v.id};${v.tipo};${v.modelo};${v.motorista};${v.velocidade} km/h;${v.consumo};${v.revisao};${v.multas};${v.status};${v.destino};${v.motivoParada || ""};${v.devolucoes || 0}\n`;
    });

    const blob = new Blob(["\ufeff" + csv], {
      type: "text/csv;charset=utf-8;"
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Relatorio_Frota_Horizonte.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

// ================================
// FILTRO STATUS
// ================================
let statusSelecionado = "todos";

document.querySelectorAll(".filtro-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filtro-btn")
      .forEach(b => b.classList.remove("ativo"));

    btn.classList.add("ativo");
    statusSelecionado = btn.dataset.status;

    aplicarFiltroStatus();
  });
});

function aplicarFiltroStatus() {
  if (statusSelecionado === "todos") {
    renderizarTabelaFrota(frota);
    return;
  }

  const filtrados = frota.filter(v =>
    normalizarStatus(v.status).includes(statusSelecionado)
  );

  renderizarTabelaFrota(filtrados);
}

// ================================
// ENTREGAS POR TIPO
// ================================
function atualizarEntregasTipos() {
  if (typeof frota === "undefined") return;

  let baias10Qtd = 0, baias10Vol = 0;
  let baias8Qtd = 0, baias8Vol = 0;
  let baias4Qtd = 0, baias4Vol = 0;
  let vansQtd = 0, vansVol = 0;
  let agregQtd = 0, agregVol = 0;

  frota.forEach(v => {
    const tipo = (v.tipo || "").toLowerCase();
    const volume = Number(v.volume || 0);

    if (tipo.includes("10")) {
      baias10Qtd++; baias10Vol += volume;
    } else if (tipo.includes("8")) {
      baias8Qtd++; baias8Vol += volume;
    } else if (tipo.includes("4")) {
      baias4Qtd++; baias4Vol += volume;
    } else if (tipo.includes("van")) {
      vansQtd++; vansVol += volume;
    } else if (tipo.includes("agreg")) {
      agregQtd++; agregVol += volume;
    }
  });

  const set = (id, val) => {
    const el = document.querySelector(id);
    if (el) el.textContent = val;
  };

  set("#qtd-baias10", baias10Qtd);
  set("#vol-baias10", `Vol: ${baias10Vol}`);

  set("#qtd-baias8", baias8Qtd);
  set("#vol-baias8", `Vol: ${baias8Vol}`);

  set("#qtd-baias4", baias4Qtd);
  set("#vol-baias4", `Vol: ${baias4Vol}`);

  set("#qtd-vans", vansQtd);
  set("#vol-vans", `Vol: ${vansVol}`);

  set("#qtd-agregados", agregQtd);
  set("#vol-agregados", `Vol: ${agregVol}`);
}

// ================================
// INIT
// ================================
document.addEventListener("DOMContentLoaded", () => {
  if (typeof frota === "undefined") {
    console.error("Base da frota não encontrada.");
    return;
  }

  atualizarPainelIndicadores();
  renderizarTabelaFrota();
  renderizarGraficoBarrasBaia();
  atualizarEntregasTipos();

  console.log("Dashboard Horizonte carregado com sucesso.");
});