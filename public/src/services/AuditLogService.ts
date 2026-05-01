import { ApiClient } from '../core/ApiClient.js';

export interface AuditLogEntry {
  id: string;
  usuarioId?: string;
  usuarioUsername?: string;
  accion: string;
  entidad: string;
  entidadId?: string;
  datosAnteriores?: Record<string, unknown>;
  datosNuevos?: Record<string, unknown>;
  ipAddress?: string;
  timestamp: string;
}

export interface AuditFiltros {
  fechaInicio?: string;
  fechaFin?: string;
  limit?: number;
}

export class AuditLogService {
  private readonly api = new ApiClient();

  public getLogs(filtros?: AuditFiltros): Promise<AuditLogEntry[]> {
    const params = new URLSearchParams();
    if (filtros?.fechaInicio) params.set('fechaInicio', filtros.fechaInicio);
    if (filtros?.fechaFin) params.set('fechaFin', filtros.fechaFin);
    if (filtros?.limit) params.set('limit', String(filtros.limit));
    const query = params.toString();
    return this.api.get<AuditLogEntry[]>(`/audit${query ? `?${query}` : ''}`);
  }
}
