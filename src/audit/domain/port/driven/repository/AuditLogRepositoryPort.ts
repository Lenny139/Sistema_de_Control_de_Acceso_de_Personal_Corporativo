import { AuditLog } from '../../../../domain/model/AuditLog';
import { CreateAuditLogDto } from '../../../../domain/model/CreateAuditLogDto';

export interface AuditLogRepositoryPort {
  save(log: CreateAuditLogDto): Promise<void>;
  findByUsuario(usuarioId: string, limit: number): Promise<AuditLog[]>;
  findByEntidad(entidad: string, entidadId: string): Promise<AuditLog[]>;
  findByRango(fechaInicio: string, fechaFin: string, limit: number): Promise<AuditLog[]>;
}
