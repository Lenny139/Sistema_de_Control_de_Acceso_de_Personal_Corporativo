import { v4 as uuidv4 } from 'uuid';
import { AuditLog } from '../../domain/model/AuditLog';
import { CreateAuditLogDto } from '../../domain/model/CreateAuditLogDto';
import { AuditLogRepositoryPort } from '../../domain/port/driven/repository/AuditLogRepositoryPort';
import { AuditServicePort } from './AuditServicePort';

export class AuditService implements AuditServicePort {
  constructor(private readonly repository: AuditLogRepositoryPort) {}

  async log(dto: CreateAuditLogDto): Promise<void> {
    await this.repository.save({
      ...dto,
      datosNuevos: {
        ...(dto.datosNuevos ?? {}),
        _auditId: uuidv4(),
        _timestamp: new Date().toISOString(),
      },
    });
  }

  async getLogsByUsuario(usuarioId: string, limit: number): Promise<AuditLog[]> {
    return this.repository.findByUsuario(usuarioId, limit);
  }

  async getLogsByRango(fechaInicio: string, fechaFin: string, limit: number): Promise<AuditLog[]> {
    return this.repository.findByRango(fechaInicio, fechaFin, limit);
  }
}
