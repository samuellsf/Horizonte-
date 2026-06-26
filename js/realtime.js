// js/realtime.js

function simularTelemetriaSatelite() {
  if (typeof frota === 'undefined') return;

  const painelAlertas = document.querySelector("#painel-alertas");
  const listaAlertas = document.querySelector("#lista-alertas");
  let alertasAtivosHtml = "";

  frota.forEach(veiculo => {
    if (veiculo.status === "Operando" || veiculo.status === "Em rota") {
      // Modifica a velocidade gerando picos altos propositais para testar o alerta
      const variacao = Math.floor(Math.random() * 17) - 8;
      veiculo.velocidade = Math.max(40, Math.min(95, veiculo.velocidade + variacao));

      // Se passar de 85 km/h, captura a infração de segurança
      if (veiculo.velocidade > 85) {
        alertasAtivosHtml += `<div class="alerta-item">⚠️ EXCESSO: ${veiculo.id} (${veiculo.motorista}) está trafegando a ${veiculo.velocidade} km/h!</div>`;
      }
    }
  });

  // Mostra ou esconde o painel de Alertas de acordo com a telemetria atual
  if (painelAlertas && listaAlertas) {
    if (alertasAtivosHtml !== "") {
      listaAlertas.innerHTML = alertasAtivosHtml;
      painelAlertas.style.display = "block";
    } else {
      painelAlertas.style.display = "none";
    }
  }

  // Atualiza os componentes visuais na tela de forma viva
  atualizarPainelIndicadores();

  const inputBuscar = document.querySelector("#buscar");
  const termo = inputBuscar ? inputBuscar.value.toLowerCase().trim() : "";
  renderizarTabelaFrota(termo === "" ? frota : frota.filter(v => v.id.toLowerCase().includes(termo) || v.motorista.toLowerCase().includes(termo)));
}

// Executa o monitoramento a cada 3 segundos
setInterval(simularTelemetriaSatelite, 3000);