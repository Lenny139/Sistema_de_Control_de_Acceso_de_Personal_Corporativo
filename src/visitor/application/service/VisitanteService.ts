import { v4 as uuidv4 } from 'uuid';
import { SQLiteDatabase } from '../../../api/infrastructure/adapter/database/SQLiteDatabase';
import { EAccionAudit, EEntidadAudit } from '../../../audit/domain/model/AbstractAuditLog';
import { AuditServiceSingleton } from '../../../audit/infrastructure/factory/AuditServiceSingleton';
import { ConflictError, NotFoundError, ValidationError } from '../../../shared/domain/DomainError';
import { RegistrarVisitanteDto } from '../../domain/model/RegistrarVisitanteDto';
import { Visitante } from '../../domain/model/Visitante';
import { VisitanteRepositoryPort } from '../../domain/port/driven/repository/VisitanteRepositoryPort';
import { VisitanteServicePort } from '../../domain/port/driver/service/VisitanteServicePort';

export class VisitanteService implements VisitanteServicePort {
  constructor(private readonly visitanteRepository: VisitanteRepositoryPort) {}

  async registrarEntradaVisitante(dto: RegistrarVisitanteDto & { guardiaId: string }): Promise<Visitante> {
    await this.validarEmpleadoAnfitrionActivo(dto.empleadoAnfitrionId);
    await this.validarPuntoControlActivo(dto.puntoControlId);

    const fechaVisita = new Date().toISOString().slice(0, 10);
    const duplicado = await this.visitanteRepository.findByDocumento(dto.documentoIdentidad, fechaVisita);

    if (duplicado && duplicado.isPresente()) {
      throw new ConflictError('El visitante ya tiene una entrada activa hoy');
    }

    const ahora = new Date();
    const visitante = new Visitante({
      id: uuidv4(),
      nombre: dto.nombre,
      apellido: dto.apellido,
      documentoIdentidad: dto.documentoIdentidad,
      empresa: dto.empresa,
      empleadoAnfitrionId: dto.empleadoAnfitrionId,
      guardiaId: dto.guardiaId,
      puntoControlId: dto.puntoControlId,
      horaEntrada: ahora,
      horaSalida: null,
      fechaVisita,
      observaciones: dto.observaciones,
      createdAt: ahora,
    });
    const created = await this.visitanteRepository.save(visitante);

    await AuditServiceSingleton.getInstance().log({
      usuarioId: dto.guardiaId,
      accion: EAccionAudit.REGISTRO_VISITANTE,
      entidad: EEntidadAudit.VISITANTE,
      entidadId: created.getId(),
      datosNuevos: {
        documentoIdentidad: created.getDocumentoIdentidad(),
        empleadoAnfitrionId: created.getEmpleadoAnfitrionId(),
        puntoControlId: created.getPuntoControlId(),
        horaEntrada: created.getHoraEntrada().toISOString(),
      },
    });

    return created;
  }

  async registrarSalidaVisitante(visitanteId: string, guardiaId: string): Promise<Visitante> {
    const visitante = await this.visitanteRepository.findById(visitanteId);

    if (!visitante) {
      throw new NotFoundError('Visitante no encontrado');
    }

    if (!visitante.isPresente()) {
      throw new ConflictError('El visitante ya tiene salida registrada');
    }

    const updated = await this.visitanteRepository.update(visitanteId, {
      guardiaId,
      horaSalida: new Date(),
    } as Partial<Visitante>);

    if (!updated) {
      throw new NotFoundError('Visitante no encontrado');
    }

    return updated;
  }

  async getVisitantesPresentes(): Promise<Visitante[]> {
    return this.visitanteRepository.findPresentes();
  }

  async getHistorialVisitantes(fechaInicio: string, fechaFin: string): Promise<Visitante[]> {
    const db = SQLiteDatabase.getInstance();
    const rows = db
      .prepare(
        `SELECT *
         FROM visitantes
         WHERE date(fecha_visita) BETWEEN date(?) AND date(?)
         ORDER BY fecha_visita DESC, hora_entrada DESC`,
      )
      .all(fechaInicio, fechaFin) as Array<{
      id: string;
      nombre: string;
      apellido: string;
      documento_identidad: string;
      empresa: string | null;
      empleado_anfitrion_id: string;
      guardia_id: string;
      punto_control_id: string;
      hora_entrada: string;
      hora_salida: string | null;
      fecha_visita: string;
      observaciones: string | null;
      created_at: string;
    }>;

    return rows.map((row) =>
      new Visitante({
        id: row.id,
        nombre: row.nombre,
        apellido: row.apellido,
        documentoIdentidad: row.documento_identidad,
        empresa: row.empresa ?? undefined,
        empleadoAnfitrionId: row.empleado_anfitrion_id,
        guardiaId: row.guardia_id,
        puntoControlId: row.punto_control_id,
        horaEntrada: new Date(row.hora_entrada),
        horaSalida: row.hora_salida ? new Date(row.hora_salida) : null,
        fechaVisita: row.fecha_visita,
        observaciones: row.observaciones ?? undefined,
        createdAt: new Date(row.created_at),
      }),
    );
  }

  async getVisitanteById(id: string): Promise<Visitante> {
    const visitante = await this.visitanteRepository.findById(id);

    if (!visitante) {
      throw new NotFoundError('Visitante no encontrado');
    }

    return visitante;
  }

  private async validarEmpleadoAnfitrionActivo(empleadoAnfitrionId: string): Promise<void> {
    const db = SQLiteDatabase.getInstance();
    const row = db
      .prepare('SELECT id, activo FROM empleados WHERE id = ? LIMIT 1')
      .get(empleadoAnfitrionId) as { id: string; activo: number } | undefined;

    if (!row) {
      throw new NotFoundError('Empleado anfitrión no encontrado');
    }

    if (Number(row.activo) !== 1) {
      throw new ValidationError('Empleado anfitrión inactivo');
    }
  }

  private async validarPuntoControlActivo(puntoControlId: string): Promise<void> {
    const db = SQLiteDatabase.getInstance();
    const row = db
      .prepare('SELECT id, activo FROM puntos_control WHERE id = ? LIMIT 1')
      .get(puntoControlId) as { id: string; activo: number } | undefined;

    if (!row) {
      throw new NotFoundError('Punto de control no encontrado');
    }

    if (Number(row.activo) !== 1) {
      throw new ValidationError('Punto de control inactivo');
    }
  }
}
