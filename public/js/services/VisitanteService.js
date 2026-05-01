import { ApiClient } from '../core/ApiClient.js';
export class VisitanteService {
    constructor() {
        this.api = new ApiClient();
    }
    getTodos() {
        return this.api.get('/visitors');
    }
    getPresentes() {
        return this.api.get('/visitors/presentes');
    }
    registrarEntrada(payload) {
        return this.api.post('/visitors/check-in', payload);
    }
    registrarSalida(visitanteId) {
        return this.api.post('/visitors/check-out', { visitanteId });
    }
}
