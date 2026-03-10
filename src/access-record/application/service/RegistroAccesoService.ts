import { v4 as uuidv4 } from 'uuid';
import { SQLiteDatabase } from '../../../api/infrastructure/adapter/database/SQLiteDatabase';
import { EAccionAudit, EEntidadAudit } from '../../../audit/domain/model/AbstractAuditLog';
import { AuditServiceSingleton } from '../../../audit/infrastructure/factory/AuditServiceSingleton';
import { ConflictError, NotFoundError, ValidationError } from '../../../shared/domain/DomainError';
import { ETipoAcceso } from '../../domain/model/ETipoAcceso';
import { EstadoPresencia } from '../../domain/model/EstadoPresencia';
import { RegistrarAccesoDto } from '../../domain/model/RegistrarAccesoDto';
import { RegistroAcceso } from '../../domain/model/RegistroAcceso';
import { RegistroAccesoRepositoryPort } from '../../domain/port/driven/repository/RegistroAccesoRepositoryPort';
import { RegistroAccesoServicePort } from '../../domain/port/driver/service/RegistroAccesoServicePort';

export class RegistroAccesoService implements RegistroAccesoServicePort {
  constructor(private readonly registroRepository: RegistroAccesoRepositoryPort) {}

  async registrarEntrada(dto: RegistrarAccesoDto): Promise<RegistroAcceso> {
    await this.validarEmpleadoActivo(dto.empleadoId);
    await this.validarPuntoControlActivo(dto.puntoControlId);

    const ultimoRegistroHoy = await this.registroRepository.findUltimoRegistroHoy(dto.empleadoId);

    if (ultimoRegistroHoy?.getTipo() === ETipoAcceso.ENTRADA) {
      throw new ConflictError(
        'El empleado ya tiene una entrada registrada. Registre la salida primero.',
      );
    }

    const ahora = new Date();
    const registro = new RegistroAcceso({
      id: uuidv4(),
      empleadoId: dto.empleadoId,
      puntoControlId: dto.puntoControlId,
      guardiaId: dto.guardiaId,
      tipo: ETipoAcceso.ENTRADA,
      timestampRegistro: ahora,
      observaciones: dto.observaciones ?? null,
      createdAt: ahora,
    });
    const created = await this.registroRepository.save(registro);

    await AuditServiceSingleton.getInstance().log({
      usuarioId: dto.guardiaId,
      accion: EAccionAudit.CHECK_IN,
      entidad: EEntidadAudit.REGISTRO_ACCESO,
      entidadId: created.getId(),
      datosNuevos: {
        empleadoId: created.getEmpleadoId(),
        puntoControlId: created.getPuntoControlId(),
        tipo: created.getTipo(),
        timestampRegistro: created.getTimestampRegistro().toISOString(),
      },
    });

    return created;
  }

  async registrarSalida(dto: RegistrarAccesoDto): Promise<RegistroAcceso> {
    await this.validarEmpleadoActivo(dto.empleadoId);
    await this.validarPuntoControlActivo(dto.puntoControlId);

    const ultimoRegistroHoy = await this.registroRepository.findUltimoRegistroHoy(dto.empleadoId);

    if (!ultimoRegistroHoy) {
      throw new ConflictError('No hay entrada registrada para el empleado hoy.');
    }

    if (ultimoRegistroHoy.getTipo() === ETipoAcceso.SALIDA) {
      throw new ConflictError('El empleado ya tiene una salida registrada.');
    }

    const ahora = new Date();
    const registro = new RegistroAcceso({
      id: uuidv4(),
      empleadoId: dto.empleadoId,
      puntoControlId: dto.puntoControlId,
      guardiaId: dto.guardiaId,
      tipo: ETipoAcceso.SALIDA,
      timestampRegistro: ahora,
      observaciones: dto.observaciones ?? null,
      createdAt: ahora,
    });
    const created = await this.registroRepository.save(registro);

    await AuditServiceSingleton.getInstance().log({
      usuarioId: dto.guardiaId,
      accion: EAccionAudit.CHECK_OUT,
      entidad: EEntidadAudit.REGISTRO_ACCESO,
      entidadId: created.getId(),
      datosNuevos: {
        empleadoId: created.getEmpleadoId(),
        puntoControlId: created.getPuntoControlId(),
        tipo: created.getTipo(),
        timestampRegistro: created.getTimestampRegistro().toISOString(),
      },
    });

    return created;
  }

  async getEmpleadosPresentes(): Promise<EstadoPresencia[]> {
    return this.registroRepository.findEmpleadosPresentes();
  }

  async getRegistrosByEmpleado(
    empleadoId: string,
    fechaInicio: string,
    fechaFin: string,
  ): Promise<RegistroAcceso[]> {
    return this.registroRepository.findByEmpleadoAndRango(empleadoId, fechaInicio, fechaFin);
  }

  async getUltimoEstadoEmpleado(empleadoId: string): Promise<ETipoAcceso | null> {
    const ultimo = await this.registroRepository.findUltimoRegistroHoy(empleadoId);
    return ultimo ? ultimo.getTipo() : null;
  }

  private async validarEmpleadoActivo(empleadoId: string): Promise<void> {
    const db = SQLiteDatabase.getInstance();
    const row = db
      .prepare('SELECT id, activo FROM empleados WHERE id = ? LIMIT 1')
      .get(empleadoId) as { id: string; activo: number } | undefined;

    if (!row) {
      throw new NotFoundError('Empleado no encontrado');
    }

    if (Number(row.activo) !== 1) {
      throw new ValidationError('Empleado inactivo');
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
