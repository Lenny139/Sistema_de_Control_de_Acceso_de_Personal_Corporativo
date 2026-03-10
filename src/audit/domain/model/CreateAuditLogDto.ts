import { EAccionAudit, EEntidadAudit } from './AbstractAuditLog';

export interface CreateAuditLogDto {
  usuarioId: string;
  accion: EAccionAudit;
  entidad: EEntidadAudit;
  entidadId?: string;
  datosAnteriores?: Record<string, unknown>;
  datosNuevos?: Record<string, unknown>;
  ipAddress?: string;
}
