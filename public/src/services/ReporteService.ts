import { ApiClient } from '../core/ApiClient';

export interface ReporteParams {
  empleado?: string;
  departamento?: string;
  fechaInicio: string;
  fechaFin: string;
}

export class ReporteService {
  private readonly api = new ApiClient();

  public getAsistencia(params: ReporteParams): Promise<unknown[]> {
    const query = new URLSearchParams({
      fechaInicio: params.fechaInicio,
      fechaFin: params.fechaFin,
      ...(params.empleado ? { empleado: params.empleado } : {}),
      ...(params.departamento ? { departamento: params.departamento } : {}),
    });

    return this.api.get<unknown[]>(`/reports/asistencia?${query.toString()}`);
  }

  public getPuntualidad(params: ReporteParams): Promise<unknown[]> {
    const query = new URLSearchParams({
      fechaInicio: params.fechaInicio,
      fechaFin: params.fechaFin,
      ...(params.empleado ? { empleado: params.empleado } : {}),
      ...(params.departamento ? { departamento: params.departamento } : {}),
    });

    return this.api.get<unknown[]>(`/reports/puntualidad?${query.toString()}`);
  }
}
