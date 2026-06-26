// js/combustivel.js

// Calcula o consumo de forma inteligente: quanto mais rápido corre, mais combustível gasta!
function calcularConsumoInstantaneo(veiculo) {
  if (veiculo.status === "Oficina" || veiculo.status === "Preventiva" || veiculo.velocidade === 0) {
    return 0;
  }

  if (veiculo.tipo === "Empilhadeira") {
    return "5.2 l/h"; // Empilhadeiras gastam por hora
  }

  // Lógica para caminhões: consumo varia com base na velocidade
  const vel = veiculo.velocidade;
  let kmL = 2.4; // Consumo padrão carregado

  if (vel > 80) kmL = 1.6; // Alta velocidade gasta muito mais!
  else if (vel < 50) kmL = 2.0; // Arranca e para na cidade gasta mais
  else kmL = 2.6; // Velocidade de cruzeiro econômica (60-80 km/h)

  // Se for agregado, costuma ser um veículo mais antigo (gasta um pouco mais)
  if (veiculo.propriedade === "Agregado") {
    kmL -= 0.2;
  }

  return `${kmL.toFixed(1)} km/l`;
}