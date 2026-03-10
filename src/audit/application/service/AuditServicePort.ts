import { AuditLog } from '../../domain/model/AuditLog';
import { CreateAuditLogDto } from '../../domain/model/CreateAuditLogDto';

export interface AuditServicePort {
  log(dto: CreateAuditLogDto): Promise<void>;
  getLogsByUsuario(usuarioId: string, limit: number): Promise<AuditLog[]>;
  getLogsByRango(fechaInicio: string, fechaFin: string, limit: number): Promise<AuditLog[]>;
}
