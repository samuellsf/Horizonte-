// js/frota.js

function gerarFrotaHorizonte() {
  const lista = [];
  const motoristasExemplo = ["João Silva", "Carlos Souza", "Marcos Lima", "André Costa", "Roberto Alves", "Ricardo Dias", "Bruno Melo", "Fernando Reis"];

  // 1. Gerar 50 Caminhões Próprios
  for (let i = 1; i <= 50; i++) {
    let status = "Operando";
    if (i === 12 || i === 35) status = "Oficina";
    if (i === 48) status = "Preventiva";

    lista.push({ 
      id: `CAM-${i}`, 
      tipo: "Caminhão", 
      propriedade: "Próprio",
      status: status,
      motorista: status === "Oficina" ? "N/A" : motoristasExemplo[i % motoristasExemplo.length],
      velocidade: status === "Operando" ? Math.floor(Math.random() * (85 - 60) + 60) : 0
    });
  }

  // 2. Gerar 4 Empilhadeiras
  for (let i = 1; i <= 4; i++) {
    lista.push({ 
      id: `EMP-${i}`, 
      tipo: "Empilhadeira", 
      propriedade: "Próprio",
      status: "Ativa",
      motorista: `Operador ${i}`,
      velocidade: 12
    });
  }

  // 3. Gerar 10 Agregados
  for (let i = 1; i <= 10; i++) {
    let status = "Em rota";
    if (i === 5) status = "Oficina";

    lista.push({ 
      id: `AGR-${i}`, 
      tipo: "Caminhão", 
      propriedade: "Agregado",
      status: status,
      motorista: status === "Oficina" ? "N/A" : `Agregado Dir. ${i}`,
      velocidade: status === "Em rota" ? Math.floor(Math.random() * (80 - 40) + 40) : 0
    });
  }

  return lista;
}

const frota = gerarFrotaHorizonte();