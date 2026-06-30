/*api.js*/

const ApiService = {
    baseUrl: "/api",

  
    async get(endpoint) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`);
            
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error("Falha ao buscar dados da API:", error);
           
            return [];
        }
    },

    async buscarFrota() {
        return await this.get("/frota");
    }
};