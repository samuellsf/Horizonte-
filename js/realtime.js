// js/realtime.js

function simularTelemetriaSatelite() {
  if (typeof frota === 'undefined') return;

  const painelAlertas = document.querySelector("#painel-alertas");
  const listaAlertas = document.querySelector("#lista-alertas");
  let alertasAtivosHtml = "";

  frota.forEach(veiculo => {
    if (veiculo.status === "Operando" || veiculo.status === "Em rota") {

      const variacao = Math.floor(Math.random() * 17) - 8;
      veiculo.velocidade = Math.max(40, Math.min(95, veiculo.velocidade + variacao));

      
      if (veiculo.velocidade > 85) {
        alertasAtivosHtml += `<div class="alerta-item">⚠️ EXCESSO: ${veiculo.id} (${veiculo.motorista}) está trafegando a ${veiculo.velocidade} km/h!</div>`;
      }
    }
  });

  
  if (painelAlertas && listaAlertas) {
    if (alertasAtivosHtml !== "") {
      listaAlertas.innerHTML = alertasAtivosHtml;
      painelAlertas.style.display = "block";
    } else {
      painelAlertas.style.display = "none";
    }
  }

 
  atualizarPainelIndicadores();

  const inputBuscar = document.querySelector("#buscar");
  const termo = inputBuscar ? inputBuscar.value.toLowerCase().trim() : "";
  renderizarTabelaFrota(termo === "" ? frota : frota.filter(v => v.id.toLowerCase().includes(termo) || v.motorista.toLowerCase().includes(termo)));
}

setInterval(simularTelemetriaSatelite, 3000);