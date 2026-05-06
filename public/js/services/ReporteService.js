import { ApiClient } from '../core/ApiClient.js';
export class ReporteService {
    constructor() {
        this.api = new ApiClient();
    }
    getAsistencia(params) {
        const query = new URLSearchParams({
            fechaInicio: params.fechaInicio,
            fechaFin: params.fechaFin,
            ...(params.empleado ? { empleadoId: params.empleado } : {}),
            ...(params.departamento ? { departamento: params.departamento } : {}),
        });
        return this.api
            .get(`/reports/asistencia?${query.toString()}`)
            .then((response) => (Array.isArray(response) ? response : response?.data ?? []));
    }
    getPuntualidad(params) {
        const query = new URLSearchParams({
            fechaInicio: params.fechaInicio,
            fechaFin: params.fechaFin,
            ...(params.empleado ? { empleadoId: params.empleado } : {}),
            ...(params.departamento ? { departamento: params.departamento } : {}),
        });
        return this.api
            .get(`/reports/puntualidad?${query.toString()}`)
            .then((response) => (Array.isArray(response) ? response : response?.data ?? []));
    }
}
