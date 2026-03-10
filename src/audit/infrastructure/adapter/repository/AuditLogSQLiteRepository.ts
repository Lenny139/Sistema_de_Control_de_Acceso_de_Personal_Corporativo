import { v4 as uuidv4 } from 'uuid';
import { SQLiteDatabase } from '../../../../api/infrastructure/adapter/database/SQLiteDatabase';
import { AuditLog } from '../../../domain/model/AuditLog';
import { EAccionAudit, EEntidadAudit } from '../../../domain/model/AbstractAuditLog';
import { CreateAuditLogDto } from '../../../domain/model/CreateAuditLogDto';
import { AuditLogRepositoryPort } from '../../../domain/port/driven/repository/AuditLogRepositoryPort';

type AuditLogRow = {
  id: string;
  usuario_id: string;
  accion: string;
  entidad: string;
  entidad_id: string | null;
  datos_anteriores: string | null;
  datos_nuevos: string | null;
  ip_address: string | null;
  timestamp: string;
};

export class AuditLogSQLiteRepository implements AuditLogRepositoryPort {
  private readonly db = SQLiteDatabase.getInstance();

  async save(log: CreateAuditLogDto): Promise<void> {
    this.db.prepare(
      `INSERT INTO audit_log (
        id,
        usuario_id,
        accion,
        entidad,
        entidad_id,
        datos_anteriores,
        datos_nuevos,
        ip_address,
        timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      uuidv4(),
      log.usuarioId,
      log.accion,
      log.entidad,
      log.entidadId ?? null,
      log.datosAnteriores ? JSON.stringify(log.datosAnteriores) : null,
      log.datosNuevos ? JSON.stringify(log.datosNuevos) : null,
      log.ipAddress ?? null,
      new Date().toISOString(),
    );
  }

  async findByUsuario(usuarioId: string, limit: number): Promise<AuditLog[]> {
    const rows = this.db
      .prepare(
        `SELECT *
         FROM audit_log
         WHERE usuario_id = ?
         ORDER BY timestamp DESC
         LIMIT ?`,
      )
      .all(usuarioId, limit) as AuditLogRow[];

    return rows.map((row) => this.mapRowToAuditLog(row));
  }

  async findByEntidad(entidad: string, entidadId: string): Promise<AuditLog[]> {
    const rows = this.db
      .prepare(
        `SELECT *
         FROM audit_log
         WHERE entidad = ?
           AND entidad_id = ?
         ORDER BY timestamp DESC`,
      )
      .all(entidad, entidadId) as AuditLogRow[];

    return rows.map((row) => this.mapRowToAuditLog(row));
  }

  async findByRango(fechaInicio: string, fechaFin: string, limit: number): Promise<AuditLog[]> {
    const rows = this.db
      .prepare(
        `SELECT *
         FROM audit_log
         WHERE date(timestamp) BETWEEN date(?) AND date(?)
         ORDER BY timestamp DESC
         LIMIT ?`,
      )
      .all(fechaInicio, fechaFin, limit) as AuditLogRow[];

    return rows.map((row) => this.mapRowToAuditLog(row));
  }

  private mapRowToAuditLog(row: AuditLogRow): AuditLog {
    return new AuditLog({
      id: row.id,
      usuarioId: row.usuario_id,
      accion: row.accion as EAccionAudit,
      entidad: row.entidad as EEntidadAudit,
      entidadId: row.entidad_id ?? undefined,
      datosAnteriores: row.datos_anteriores
        ? (JSON.parse(row.datos_anteriores) as Record<string, unknown>)
        : null,
      datosNuevos: row.datos_nuevos
        ? (JSON.parse(row.datos_nuevos) as Record<string, unknown>)
        : null,
      ipAddress: row.ip_address,
      timestamp: new Date(row.timestamp),
    });
  }
}
