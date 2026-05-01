import { ApiClient } from '../core/ApiClient.js';
export class AuditLogService {
    constructor() {
        this.api = new ApiClient();
    }
    getLogs(filtros) {
        const params = new URLSearchParams();
        if (filtros?.fechaInicio)
            params.set('fechaInicio', filtros.fechaInicio);
        if (filtros?.fechaFin)
            params.set('fechaFin', filtros.fechaFin);
        if (filtros?.limit)
            params.set('limit', String(filtros.limit));
        const query = params.toString();
        return this.api.get(`/audit${query ? `?${query}` : ''}`);
    }
}
