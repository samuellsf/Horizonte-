// js/frota.js

function gerarFrotaHorizonte() {
  const lista = [];
  
  const motoristasExemplo = ["Paulo", "Brenda", "Luís", "Samuel", "André Costa", "Roberto Alves", "Ricardo Dias", "Bruno Melo", "Fernando Reis"];
  const modelosCaminhao = ["Volvo FH 540", "Mercedes-Benz Actros", "DAF XF 530", "Scania R540"];
  const destinosExemplo = ["Porto de Santos/SP", "Goiânia/GO", "Rio de Janeiro/RJ", "Belo Horizonte/MG", "Curitiba/PR", "Brasília/DF"];
  const motivosDevolucao = ["Destinatário ausente", "Recusa por avaria", "Divergência na NF", "Endereço não localizado"];

  const motivosOficina = [
    "Troca de pastilhas de freio", "Reparo na suspensão dianteira", "Injeção eletrônica falhando", "Vazamento de óleo no cárter",
    "Problema no sistema de arrefecimento", "Alinhamento e balanceamento", "Substituição de correia dentada", "Falha no sistema de transmissão",
    "Troca de amortecedores", "Revisão completa do motor", "Problema no sistema elétrico", "Falha no turbo compressor",
    "Substituição de embreagem", "Reparo no sistema de direção hidráulica", "Troca de filtros e fluidos essenciais", "Problema no sistema de escapamento",
    "Revisão do sistema de freios ABS", "Falha no sistema de injeção de combustível", "Substituição de velas e cabos de ignição", "Reparo no sistema de ar condicionado",
    "Problema no sistema de iluminação", "Revisão do sistema de suspensão pneumática", "Falha no sistema de controle de tração", "Substituição de rolamentos e buchas",
    "Reparo no sistema de direção assistida", "Troca de pneus desgastados", "Problema no sistema de freio a ar", "Revisão do sistema de transmissão automática",
    "Falha no sistema de monitoramento eletrônico", "Substituição de correias e tensores"
  ];

  const gerarPlacaMercosul = (tipo, i) => `${tipo.substring(0,2)}${i}A${99 - i}`;

  // =========================
  // 1. CAMINHÕES (50)
  // =========================
  for (let i = 1; i <= 50; i++) {

    let status = "Em rota";
    let motivoParada = "";
    let multas = "Nenhuma";
    let velocidade = Math.floor(Math.random() * (85 - 60) + 60);
    let consumo = "2.6 km/l";
    let devolucoesHoje = 0;
    let motivoDevolucaoTexto = "";

    let kmAtual = 120000 + (i * 350);
    let kmProximaRevisao = Math.ceil(kmAtual / 5000) * 5000;
    let kmFaltantes = kmProximaRevisao - kmAtual;
    let revisaoTexto = `${kmFaltantes} km`;

    // FIXO 1
    if (i === 1) {
      lista.push({
        id: "CAM-1",
        tipo: "Caminhão",
        modelo: "Volvo FH 540",
        placa: "CA1A98",
        propriedade: "Próprio",
        motorista: "Carla",
        velocidade: 68,
        consumo: "2.6 km/l",
        revisao: "4.200 km",
        multas: "Nenhuma",
        status: "Em rota",
        motivoParada: "",
        devolucoes: 0,
        motivoDevolucao: "",
        destino: "Porto de Santos/SP",
        entregas: 12
      });
      continue;
    }

    // FIXO 13
    if (i === 13) {
      lista.push({
        id: "CAM-13",
        tipo: "Caminhão",
        modelo: "Scania R540",
        placa: "CA13A86",
        propriedade: "Próprio",
        motorista: "Ricardo Dias",
        velocidade: 0,
        consumo: "—",
        revisao: "🔥 REVISAR (5.005 km)",
        multas: "1 (Excesso de Vel.)",
        status: "Oficina",
        motivoParada: "Troca de pastilhas de freio",
        devolucoes: 0,
        motivoDevolucao: "",
        destino: "Oficina Central",
        entregas: 0
      });
      continue;
    }

    if (i === 12 || i === 35 || i === 44) {
      status = "Oficina";
      velocidade = 0;
      consumo = "—";
      motivoParada = motivosOficina[i % motivosOficina.length];
    }

    if (i === 22) {
      status = "Preventiva";
      velocidade = 0;
      consumo = "—";
      motivoParada = "Revisão periódica obrigatória";
    }

    if (kmFaltantes < 200 || i === 3 || i === 14) {
      revisaoTexto = `🚨 REVISAR (${kmAtual.toLocaleString('pt-BR')} km)`;
    }

    if (i === 3 || i === 24 || i === 38) {
      multas = "1 (Excesso Velocidade)";
    }

    if (i === 5 || i === 18 || i === 29 || i === 47) {
      devolucoesHoje = Math.floor(Math.random() * 2) + 1;
      motivoDevolucaoTexto = motivosDevolucao[i % motivosDevolucao.length];
    }

    lista.push({
      id: `CAM-${i}`,
      tipo: "Caminhão",
      modelo: modelosCaminhao[i % modelosCaminhao.length],
      placa: gerarPlacaMercosul("CAM", i),
      propriedade: "Próprio",
      status: status,
      motivoParada: motivoParada,
      multas: multas,
      revisao: revisaoTexto,
      motorista: status === "Oficina" ? "N/A" : motoristasExemplo[i % motoristasExemplo.length],
      velocidade: velocidade,
      consumo: consumo,
      km: kmAtual,
      devolucoes: devolucoesHoje,
      motivoDevolucao: motivoDevolucaoTexto,
      destino: status === "Oficina" ? "Oficina Central" : destinosExemplo[i % destinosExemplo.length],

      // ✅ ENTREGAS
      entregas: status === "Em rota"
        ? Math.floor(Math.random() * 10) + 5
        : 0
    });
  } 

  // =========================
  // 2. VANS
  // =========================
  for (let i = 1; i <= 4; i++) {
    lista.push({
      id: `VAN-${i}`,
      tipo: "Van",
      modelo: "Mercedes-Benz Sprinter",
      placa: gerarPlacaMercosul("VAN", i),
      propriedade: "Próprio",
      status: "Em rota",
      motivoParada: "",
      multas: "Nenhuma",
      revisao: "3.400 km",
      motorista: motoristasExemplo[(i + 2) % motoristasExemplo.length],
      velocidade: Math.floor(Math.random() * (75 - 50) + 50),
      consumo: "8.5 km/l",
      km: 45000,
      devolucoes: 0,
      motivoDevolucao: "",
      destino: "Entrega Urbana Local",
      entregas: 6
    });
  }

  // =========================
  // 3. ELÉTRICOS
  // =========================
  for (let i = 1; i <= 4; i++) {
    lista.push({
      id: `ELE-${i}`,
      tipo: "Elétrico",
      modelo: "BYD ETP3",
      placa: gerarPlacaMercosul("ELE", i),
      propriedade: "Próprio",
      status: "Em rota",
      motivoParada: "",
      multas: "Nenhuma",
      revisao: "4.800 km",
      motorista: motoristasExemplo[(i + 4) % motoristasExemplo.length],
      velocidade: Math.floor(Math.random() * (60 - 40) + 40),
      consumo: "0.4 kWh/km",
      km: 15000,
      devolucoes: 0,
      motivoDevolucao: "",
      destino: "Distribuição Green Log",
      entregas: 4
    });
  }

  // =========================
  // 4. AGREGADOS
  // =========================
  for (let i = 1; i <= 10; i++) {
    lista.push({
      id: `AGR-${i}`,
      tipo: "Caminhão",
      modelo: "Volvo VM 330",
      placa: gerarPlacaMercosul("AGR", i),
      propriedade: "Agregado",
      status: "Em rota",
      motivoParada: "",
      multas: i === 5 ? "1 (Evasão de Pedágio)" : "Nenhuma",
      revisao: "Agregado",
      motorista: `Parceiro ${motoristasExemplo[i % motoristasExemplo.length]}`,
      velocidade: Math.floor(Math.random() * (80 - 50) + 50),
      consumo: "2.8 km/l",
      km: 280000,
      devolucoes: 0,
      motivoDevolucao: "",
      destino: destinosExemplo[i % destinosExemplo.length],
      entregas: 3
    });
  }

  // =========================
  // 5. EMPILHADEIRAS
  // =========================
  for (let i = 1; i <= 4; i++) {
    lista.push({
      id: `EMP-${i}`,
      tipo: "Empilhadeira",
      modelo: "Toyota Interlog",
      placa: "INTERNA",
      propriedade: "Próprio",
      status: "No Pátio",
      motivoParada: "",
      multas: "Nenhuma",
      revisao: "240 horas",
      motorista: `Operador M.${i}`,
      velocidade: 8,
      consumo: "—",
      km: 850,
      devolucoes: 0,
      motivoDevolucao: "",
      destino: "Zonas de Carga",
      entregas: 0
    });
  }

  return lista;
}

const frota = gerarFrotaHorizonte();