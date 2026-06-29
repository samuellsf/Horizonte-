// js/detalhes.js

document.addEventListener("DOMContentLoaded", () => {
    // 1. Pega o ID que foi salvo no LocalStorage ao clicar em "Ver"
    const idSelecionado = localStorage.getItem("veiculoSelecionado") || "CAM-1";

    // 2. Busca o veículo correspondente na nossa lista global
    const veiculoEncontrado = typeof frota !== 'undefined' 
        ? frota.find(v => v.id === idSelecionado) 
        : null;

    // 3. Mapeia os elementos da tela
    const elId = document.querySelector("#veiculo-id");
    const elTipo = document.querySelector("#veiculo-tipo");
    const elKm = document.querySelector("#veiculo-km");
    const elCombustivel = document.querySelector("#veiculo-combustivel");
    const elMotor = document.querySelector("#veiculo-motor");
    const elRevisao = document.querySelector("#veiculo-revisao");
    const elLocalizacao = document.querySelector("#veiculo-localizacao");

    // 4. Alimenta a tela com os dados
    if (elId) elId.textContent = idSelecionado;

    if (veiculoEncontrado) {
        if (elTipo) elTipo.textContent = veiculoEncontrado.tipo;
        
        
        if (elKm) elKm.textContent = veiculoEncontrado.tipo === "Empilhadeira" ? "N/A (Horas: 1.240h)" : `${(500000 + (parseInt(idSelecionado.split('-')[1]) * 123)).toLocaleString('pt-BR')} km`;
        if (elCombustivel) elCombustivel.textContent = `${Math.floor(Math.random() * (100 - 20) + 20)}%`;
        if (elMotor) elMotor.textContent = veiculoEncontrado.tipo === "Empilhadeira" ? "Elétrica" : "520cv";
        if (elRevisao) elRevisao.textContent = "15/06/2026";
       if (elLocalizacao) {
    const status = veiculoEncontrado.status;

    const mapaStatus = {
        "Oficina": "Oficina Central",
        "Em Oficina": "Oficina Central",
        "Rota": "Em Rota",
        "Em Rota": "Em Rota",
        "Pátio": "No Pátio",
        "Patio": "No Pátio",
        "Concluído": "Concluído"
    };

    elLocalizacao.textContent = mapaStatus[status] || status;
}
    }
});