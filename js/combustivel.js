/*combustivel.js*/

const CombustivelService = {
    
  
    estrategias: {
        "Empilhadeira": () => "5.2 l/h",
        "Caminhão": (veiculo) => {
            const kmL = CombustivelService._calcularCaminhao(veiculo);
            return `${kmL.toFixed(1)} km/l`;
        }
    },

    calcular(veiculo) {
        if (["Oficina", "Preventiva"].includes(veiculo.status) || veiculo.velocidade === 0) {
            return "0.0";
        }

        const calcularEstrategia = this.estrategias[veiculo.tipo] || this.estrategias["Caminhão"];
        return calcularEstrategia(veiculo);
    },

    _calcularCaminhao(veiculo) {
        const vel = veiculo.velocidade;
        let kmL = (vel > 80) ? 1.6 : (vel < 50) ? 2.0 : 2.6;
        
      
        return veiculo.propriedade === "Agregado" ? kmL - 0.2 : kmL;
    }
};