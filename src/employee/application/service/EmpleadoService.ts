import { v4 as uuidv4 } from 'uuid';
import { SQLiteDatabase } from '../../../api/infrastructure/adapter/database/SQLiteDatabase';
import { ConflictError, NotFoundError, ValidationError } from '../../../shared/domain/DomainError';
import { CreateEmpleadoDto } from '../../domain/model/CreateEmpleadoDto';
import { Empleado } from '../../domain/model/Empleado';
import { EmpleadoFilters } from '../../domain/model/EmpleadoFilters';
import { HorarioLaboral } from '../../domain/model/HorarioLaboral';
import { UpdateEmpleadoDto } from '../../domain/model/UpdateEmpleadoDto';
import { EmpleadoRepositoryPort } from '../../domain/port/driven/repository/EmpleadoRepositoryPort';
import { EmpleadoServicePort } from '../../domain/port/driver/service/EmpleadoServicePort';

export class EmpleadoService implements EmpleadoServicePort {
  constructor(private readonly empleadoRepository: EmpleadoRepositoryPort) {}

  async createEmpleado(data: CreateEmpleadoDto): Promise<Empleado> {
    const existingEmpleado = await this.empleadoRepository.findByCodigoEmpleado(data.codigoEmpleado);

    if (existingEmpleado) {
      throw new ConflictError('El código de empleado ya existe');
    }

    const horarioLaboral = new HorarioLaboral(data.horaInicioLaboral, data.horaFinLaboral);

    if (!horarioLaboral.isValid()) {
      throw new ValidationError('Horario laboral inválido');
    }

    const empleado = new Empleado({
      id: uuidv4(),
      usuarioId: data.usuarioId,
      codigoEmpleado: data.codigoEmpleado,
      nombre: data.nombre,
      apellido: data.apellido,
      departamento: data.departamento,
      cargo: data.cargo,
      horarioLaboral,
      activo: true,
      createdAt: new Date(),
    });

    return this.empleadoRepository.save(empleado);
  }

  async updateEmpleado(id: string, data: UpdateEmpleadoDto): Promise<Empleado> {
    const existingEmpleado = await this.empleadoRepository.findById(id);

    if (!existingEmpleado) {
      throw new NotFoundError('Empleado no encontrado');
    }

    const horaInicio = data.horaInicioLaboral ?? existingEmpleado.getHorarioLaboral().getHoraInicio();
    const horaFin = data.horaFinLaboral ?? existingEmpleado.getHorarioLaboral().getHoraFin();
    const nuevoHorario = new HorarioLaboral(horaInicio, horaFin);

    if (!nuevoHorario.isValid()) {
      throw new ValidationError('Horario laboral inválido');
    }

    const updated = await this.empleadoRepository.update(id, {
      usuarioId: data.usuarioId,
      codigoEmpleado: data.codigoEmpleado,
      nombre: data.nombre,
      apellido: data.apellido,
      departamento: data.departamento,
      cargo: data.cargo,
      horarioLaboral: nuevoHorario,
      activo: data.activo,
    } as Partial<Empleado>);

    if (!updated) {
      throw new NotFoundError('Empleado no encontrado');
    }

    return updated;
  }

  async deactivateEmpleado(id: string): Promise<boolean> {
    const existingEmpleado = await this.empleadoRepository.findById(id);

    if (!existingEmpleado) {
      throw new NotFoundError('Empleado no encontrado');
    }

    const db = SQLiteDatabase.getInstance();
    const row = db
      .prepare(
        `SELECT COUNT(1) AS total
         FROM registros_acceso r
         WHERE r.empleado_id = ?
           AND r.tipo = 'ENTRADA'
           AND NOT EXISTS (
             SELECT 1
             FROM registros_acceso s
             WHERE s.empleado_id = r.empleado_id
               AND s.tipo = 'SALIDA'
               AND s.timestamp_registro >= r.timestamp_registro
           )`,
      )
      .get(id) as { total: number };

    if (row.total > 0) {
      throw new ValidationError('No se puede desactivar: empleado con acceso abierto');
    }

    return this.empleadoRepository.delete(id);
  }

  async getEmpleadoById(id: string): Promise<Empleado> {
    const empleado = await this.empleadoRepository.findById(id);

    if (!empleado) {
      throw new NotFoundError('Empleado no encontrado');
    }

    return empleado;
  }

  async getEmpleadoByCodigo(codigo: string): Promise<Empleado> {
    const empleado = await this.empleadoRepository.findByCodigoEmpleado(codigo);

    if (!empleado) {
      throw new NotFoundError('Empleado no encontrado');
    }

    return empleado;
  }

  async getAllEmpleados(filters?: EmpleadoFilters): Promise<Empleado[]> {
    let empleados: Empleado[];

    if (filters?.departamento) {
      empleados = await this.empleadoRepository.findByDepartamento(filters.departamento);
    } else if (filters?.activo === true) {
      empleados = await this.empleadoRepository.findActivos();
    } else {
      empleados = await this.empleadoRepository.findAll();
    }

    if (filters?.activo === false) {
      return empleados.filter((empleado) => !empleado.getActivo());
    }

    return empleados;
  }

  async searchEmpleados(query: string): Promise<Empleado[]> {
    return this.empleadoRepository.findByNombreOrCodigo(query);
  }
}
