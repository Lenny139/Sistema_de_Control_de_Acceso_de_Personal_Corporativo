import { SQLiteDatabase } from '../../../../api/infrastructure/adapter/database/SQLiteDatabase';
import { Empleado } from '../../../domain/model/Empleado';
import { HorarioLaboral } from '../../../domain/model/HorarioLaboral';
import { EmpleadoRepositoryPort } from '../../../domain/port/driven/repository/EmpleadoRepositoryPort';

type EmpleadoRow = {
  id: string;
  usuario_id: string | null;
  codigo_empleado: string;
  nombre: string;
  apellido: string;
  departamento: string;
  cargo: string;
  hora_inicio_laboral: string;
  hora_fin_laboral: string;
  activo: number;
  created_at: string;
};

type EmpleadoUpdate = Partial<{
  usuarioId: string;
  codigoEmpleado: string;
  nombre: string;
  apellido: string;
  departamento: string;
  cargo: string;
  horarioLaboral: HorarioLaboral;
  activo: boolean;
}>;

export class EmpleadoSQLiteRepository implements EmpleadoRepositoryPort {
  private readonly db = SQLiteDatabase.getInstance();

  async findById(id: string): Promise<Empleado | null> {
    const row = this.db
      .prepare('SELECT * FROM empleados WHERE id = ? LIMIT 1')
      .get(id) as EmpleadoRow | undefined;

    return row ? this.mapRowToEmpleado(row) : null;
  }

  async findAll(): Promise<Empleado[]> {
    const rows = this.db
      .prepare('SELECT * FROM empleados ORDER BY created_at DESC')
      .all() as EmpleadoRow[];

    return rows.map((row) => this.mapRowToEmpleado(row));
  }

  async findByCodigoEmpleado(codigo: string): Promise<Empleado | null> {
    const row = this.db
      .prepare('SELECT * FROM empleados WHERE codigo_empleado = ? LIMIT 1')
      .get(codigo) as EmpleadoRow | undefined;

    return row ? this.mapRowToEmpleado(row) : null;
  }

  async findByDepartamento(departamento: string): Promise<Empleado[]> {
    const rows = this.db
      .prepare('SELECT * FROM empleados WHERE departamento = ? ORDER BY created_at DESC')
      .all(departamento) as EmpleadoRow[];

    return rows.map((row) => this.mapRowToEmpleado(row));
  }

  async findByNombreOrCodigo(query: string): Promise<Empleado[]> {
    const term = `%${query}%`;
    const rows = this.db
      .prepare(
        `SELECT *
         FROM empleados
         WHERE (id LIKE ? OR nombre LIKE ? OR apellido LIKE ? OR codigo_empleado LIKE ?)
         AND activo = 1
         ORDER BY nombre ASC, apellido ASC
         LIMIT 10`,
      )
      .all(term, term, term, term) as EmpleadoRow[];

    return rows.map((row) => this.mapRowToEmpleado(row));
  }

  async findActivos(): Promise<Empleado[]> {
    const rows = this.db
      .prepare('SELECT * FROM empleados WHERE activo = 1 ORDER BY created_at DESC')
      .all() as EmpleadoRow[];

    return rows.map((row) => this.mapRowToEmpleado(row));
  }

  async save(item: Empleado): Promise<Empleado> {
    this.db.prepare(
      `INSERT INTO empleados (
        id,
        usuario_id,
        codigo_empleado,
        nombre,
        apellido,
        departamento,
        cargo,
        hora_inicio_laboral,
        hora_fin_laboral,
        activo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      item.getId(),
      item.getUsuarioId() ?? null,
      item.getCodigoEmpleado(),
      item.getNombre(),
      item.getApellido(),
      item.getDepartamento(),
      item.getCargo(),
      item.getHorarioLaboral().getHoraInicio(),
      item.getHorarioLaboral().getHoraFin(),
      item.getActivo() ? 1 : 0,
    );

    const created = await this.findById(item.getId());

    if (!created) {
      throw new Error('No fue posible crear el empleado');
    }

    return created;
  }

  async update(id: string, item: Partial<Empleado>): Promise<Empleado | null> {
    const current = await this.findById(id);

    if (!current) {
      return null;
    }

    const updates = item as unknown as EmpleadoUpdate;
    const horario = updates.horarioLaboral ?? current.getHorarioLaboral();

    this.db.prepare(
      `UPDATE empleados
       SET usuario_id = ?,
           codigo_empleado = ?,
           nombre = ?,
           apellido = ?,
           departamento = ?,
           cargo = ?,
           hora_inicio_laboral = ?,
           hora_fin_laboral = ?,
           activo = ?,
           updated_at = datetime('now')
       WHERE id = ?`,
    ).run(
      updates.usuarioId ?? current.getUsuarioId() ?? null,
      updates.codigoEmpleado ?? current.getCodigoEmpleado(),
      updates.nombre ?? current.getNombre(),
      updates.apellido ?? current.getApellido(),
      updates.departamento ?? current.getDepartamento(),
      updates.cargo ?? current.getCargo(),
      horario.getHoraInicio(),
      horario.getHoraFin(),
      updates.activo !== undefined ? (updates.activo ? 1 : 0) : current.getActivo() ? 1 : 0,
      id,
    );

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = this.db.prepare(
      `UPDATE empleados
       SET activo = 0,
           updated_at = datetime('now')
       WHERE id = ?`,
    ).run(id);

    return result.changes > 0;
  }

  private mapRowToEmpleado(row: any): Empleado {
    return new Empleado({
      id: String(row.id),
      usuarioId: row.usuario_id ? String(row.usuario_id) : undefined,
      codigoEmpleado: String(row.codigo_empleado),
      nombre: String(row.nombre),
      apellido: String(row.apellido),
      departamento: String(row.departamento),
      cargo: String(row.cargo),
      horarioLaboral: new HorarioLaboral(
        String(row.hora_inicio_laboral),
        String(row.hora_fin_laboral),
      ),
      activo: Number(row.activo) === 1,
      createdAt: new Date(row.created_at),
    });
  }
}
