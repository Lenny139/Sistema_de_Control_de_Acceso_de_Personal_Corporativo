import { ApiClient } from '../core/ApiClient';
export class ReporteService {
    constructor() {
        this.api = new ApiClient();
    }
    getAsistencia(params) {
        const query = new URLSearchParams({
            fechaInicio: params.fechaInicio,
            fechaFin: params.fechaFin,
            ...(params.empleado ? { empleado: params.empleado } : {}),
            ...(params.departamento ? { departamento: params.departamento } : {}),
        });
        return this.api.get(`/reports/asistencia?${query.toString()}`);
    }
    getPuntualidad(params) {
        const query = new URLSearchParams({
            fechaInicio: params.fechaInicio,
            fechaFin: params.fechaFin,
            ...(params.empleado ? { empleado: params.empleado } : {}),
            ...(params.departamento ? { departamento: params.departamento } : {}),
        });
        return this.api.get(`/reports/puntualidad?${query.toString()}`);
    }
}
