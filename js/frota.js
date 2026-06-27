// js/frota.js

function gerarFrotaHorizonte() {
  const lista = [];
  
  // Bancos de dados simulados da Frota Horizonte
  const motoristasExemplo = ["Paulo", "Carla", "Luís", "André Costa", "Roberto Alves", "Ricardo Dias", "Bruno Melo", "Fernando Reis"];
  const modelosCaminhao = ["Scania R540", "Volvo FH 540", "Mercedes-Benz Actros", "DAF XF 530"];
  const destinosExemplo = ["Porto de Santos/SP", "Goiânia/GO", "Rio de Janeiro/RJ", "Belo Horizonte/MG", "Curitiba/PR", "Brasília/DF"];

  const gerarPlacaMercosul = (tipo, i) => `${tipo.substring(0,2)}${i}A${99 - i}`;

  // 1. Gerar 50 Caminhões Próprios
  for (let i = 1; i <= 50; i++) {
    let status = "Em rota";
    if (i === 12 || i === 35) status = "Oficina";
    if (i === 48) status = "Preventiva";

    lista.push({ 
      id: `CAM-${i}`, 
      tipo: "Caminhão", 
      modelo: modelosCaminhao[i % modelosCaminhao.length],
      placa: gerarPlacaMercosul("CAM", i),
      propriedade: "Próprio",
      status: status,
      motorista: status === "Oficina" ? "N/A" : motoristasExemplo[i % motoristasExemplo.length],
      velocidade: status === "Em rota" ? Math.floor(Math.random() * (85 - 60) + 60) : 0,
      km: 120000 + (i * 3150),
      entregasHoje: status === "Oficina" ? 0 : Math.floor(Math.random() * 4) + 1,
      atrasado: i % 15 === 0 && status === "Em rota", // Simula alguns veículos em atraso
      destino: status === "Oficina" ? "Oficina Central" : destinosExemplo[i % destinosExemplo.length]
    });
  }

  // 2. Gerar 4 Vans (Substituindo o loop genérico anterior)
  for (let i = 1; i <= 4; i++) {
    lista.push({ 
      id: `VAN-${i}`, 
      tipo: "Van", 
      modelo: "Mercedes-Benz Sprinter",
      placa: gerarPlacaMercosul("VAN", i),
      propriedade: "Próprio",
      status: "Em rota",
      motorista: motoristasExemplo[(i + 2) % motoristasExemplo.length],
      velocidade: Math.floor(Math.random() * (75 - 50) + 50),
      km: 45000 + (i * 2100),
      entregasHoje: Math.floor(Math.random() * 6) + 3,
      atrasado: i === 3, // Força uma van em atraso para compor os dados da imagem
      destino: "Entrega Urbana Local"
    });
  }

  // 3. Gerar 4 Veículos Elétricos
  for (let i = 1; i <= 4; i++) {
    lista.push({ 
      id: `ELE-${i}`, 
      tipo: "Elétrico", 
      modelo: "BYD ETP3",
      placa: gerarPlacaMercosul("ELE", i),
      propriedade: "Próprio",
      status: "Em rota",
      motorista: motoristasExemplo[(i + 4) % motoristasExemplo.length],
      velocidade: Math.floor(Math.random() * (60 - 40) + 40),
      km: 15000 + (i * 1200),
      entregasHoje: Math.floor(Math.random() * 5) + 4,
      atrasado: false,
      destino: "Distribuição Green Log"
    });
  }

  // 4. Gerar 10 Agregados
  for (let i = 1; i <= 10; i++) {
    let status = "Em rota";
    if (i === 5) status = "Oficina";

    lista.push({ 
      id: `AGR-${i}`, 
      tipo: "Caminhão", 
      modelo: "Volvo VM 330",
      placa: gerarPlacaMercosul("AGR", i),
      propriedade: "Agregado",
      status: status,
      motorista: status === "Oficina" ? "N/A" : `Parceiro ${motoristasExemplo[i % motoristasExemplo.length]}`,
      velocidade: status === "Em rota" ? Math.floor(Math.random() * (80 - 50) + 50) : 0,
      km: 280000 + (i * 4300),
      entregasHoje: status === "Oficina" ? 0 : Math.floor(Math.random() * 3) + 1,
      atrasado: i === 2, // Um agregado atrasado
      destino: destinosExemplo[(i + 1) % destinosExemplo.length]
    });
  }

  // 5. Gerar 4 Empilhadeiras (Operando fixas no Pátio Interno)
  for (let i = 1; i <= 4; i++) {
    lista.push({ 
      id: `EMP-${i}`, 
      tipo: "Empilhadeira", 
      modelo: "Toyota Interlog",
      placa: "INTERNA",
      propriedade: "Próprio",
      status: "No Pátio", // Marcadas estritamente para o Pátio Interno
      motorista: `Operador M.${i}`,
      velocidade: 8, // Velocidade controlada de pátio
      km: 850 + (i * 120), // Horas de operação acumuladas
      entregasHoje: Math.floor(Math.random() * 15) + 10, // Movimentações internas
      atrasado: false,
      destino: "Zonas de Carga / Baías"
    });
  }

  return lista;
}

const frota = gerarFrotaHorizonte();