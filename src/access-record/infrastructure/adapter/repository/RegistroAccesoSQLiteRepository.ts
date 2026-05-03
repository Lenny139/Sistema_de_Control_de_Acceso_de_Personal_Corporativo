import { SQLiteDatabase } from '../../../../api/infrastructure/adapter/database/SQLiteDatabase';
import { ETipoAcceso } from '../../../domain/model/ETipoAcceso';
import { EstadoPresencia } from '../../../domain/model/EstadoPresencia';
import { RegistroAcceso } from '../../../domain/model/RegistroAcceso';
import { RegistroAccesoRepositoryPort } from '../../../domain/port/driven/repository/RegistroAccesoRepositoryPort';

type RegistroAccesoRow = {
  id: string;
  empleado_id: string;
  punto_control_id: string;
  guardia_id: string;
  tipo: ETipoAcceso;
  timestamp_registro: string;
  observaciones: string | null;
  created_at: string;
};

export class RegistroAccesoSQLiteRepository implements RegistroAccesoRepositoryPort {
  private readonly db = SQLiteDatabase.getInstance();

  async findById(id: string): Promise<RegistroAcceso | null> {
    const row = this.db
      .prepare('SELECT * FROM registros_acceso WHERE id = ? LIMIT 1')
      .get(id) as RegistroAccesoRow | undefined;

    return row ? this.mapRowToRegistro(row) : null;
  }

  async findAll(): Promise<RegistroAcceso[]> {
    const rows = this.db
      .prepare('SELECT * FROM registros_acceso ORDER BY timestamp_registro DESC')
      .all() as RegistroAccesoRow[];

    return rows.map((row) => this.mapRowToRegistro(row));
  }

  async save(
    item: RegistroAcceso,
    withinTransaction?: (db: SQLiteDatabase, created: RegistroAcceso) => void,
  ): Promise<RegistroAcceso> {
    const created = this.db.transaction(() => {
      this.db.prepare(
        `INSERT INTO registros_acceso (
          id,
          empleado_id,
          punto_control_id,
          guardia_id,
          tipo,
          timestamp_registro,
          observaciones,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        item.getId(),
        item.getEmpleadoId(),
        item.getPuntoControlId(),
        item.getGuardiaId(),
        item.getTipo(),
        item.getTimestampRegistro().toISOString(),
        item.getObservaciones(),
        item.getCreatedAt().toISOString(),
      );

      const row = this.db
        .prepare('SELECT * FROM registros_acceso WHERE id = ? LIMIT 1')
        .get(item.getId()) as RegistroAccesoRow | undefined;

      const result = row ? this.mapRowToRegistro(row) : null;

      // Execute callback within transaction if provided
      if (withinTransaction && result) {
        withinTransaction(this.db, result);
      }

      return result;
    })();

    if (!created) {
      throw new Error('No fue posible crear el registro de acceso');
    }

    return created;
  }

  async update(id: string, item: Partial<RegistroAcceso>): Promise<RegistroAcceso | null> {
    const current = await this.findById(id);

    if (!current) {
      return null;
    }

    const tipo = (item as unknown as { tipo?: ETipoAcceso }).tipo ?? current.getTipo();
    const observaciones =
      (item as unknown as { observaciones?: string | null }).observaciones ??
      current.getObservaciones();

    this.db.prepare(
      `UPDATE registros_acceso
       SET tipo = ?,
           observaciones = ?
       WHERE id = ?`,
    ).run(tipo, observaciones, id);

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = this.db.prepare('DELETE FROM registros_acceso WHERE id = ?').run(id);
    return result.changes > 0;
  }

  async findByEmpleadoAndFecha(empleadoId: string, fecha: string): Promise<RegistroAcceso[]> {
    const rows = this.db
      .prepare(
        `SELECT * FROM registros_acceso
         WHERE empleado_id = ?
           AND date(timestamp_registro) = date(?)
         ORDER BY timestamp_registro ASC`,
      )
      .all(empleadoId, fecha) as RegistroAccesoRow[];

    return rows.map((row) => this.mapRowToRegistro(row));
  }

  async findByEmpleadoAndRango(
    empleadoId: string,
    fechaInicio: string,
    fechaFin: string,
  ): Promise<RegistroAcceso[]> {
    const rows = this.db
      .prepare(
        `SELECT * FROM registros_acceso
         WHERE empleado_id = ?
           AND date(timestamp_registro) BETWEEN date(?) AND date(?)
         ORDER BY timestamp_registro ASC`,
      )
      .all(empleadoId, fechaInicio, fechaFin) as RegistroAccesoRow[];

    return rows.map((row) => this.mapRowToRegistro(row));
  }

  async findByDepartamentoAndRango(
    departamento: string,
    fechaInicio: string,
    fechaFin: string,
  ): Promise<RegistroAcceso[]> {
    const rows = this.db
      .prepare(
        `SELECT ra.*
         FROM registros_acceso ra
         INNER JOIN empleados e ON e.id = ra.empleado_id
         WHERE e.departamento = ?
           AND date(ra.timestamp_registro) BETWEEN date(?) AND date(?)
         ORDER BY ra.timestamp_registro ASC`,
      )
      .all(departamento, fechaInicio, fechaFin) as RegistroAccesoRow[];

    return rows.map((row) => this.mapRowToRegistro(row));
  }

  async findUltimoRegistroHoy(empleadoId: string): Promise<RegistroAcceso | null> {
    const row = this.db
      .prepare(
        `SELECT * FROM registros_acceso
         WHERE empleado_id = ?
           AND date(timestamp_registro) = date('now')
         ORDER BY timestamp_registro DESC
         LIMIT 1`,
      )
      .get(empleadoId) as RegistroAccesoRow | undefined;

    return row ? this.mapRowToRegistro(row) : null;
  }

  async findEmpleadosPresentes(): Promise<EstadoPresencia[]> {
    const rows = this.db
      .prepare(
        `SELECT e.id, e.codigo_empleado, e.nombre, e.apellido, e.departamento,
                ra.punto_control_id, pc.nombre as nombre_punto_control, ra.timestamp_registro
         FROM registros_acceso ra
         INNER JOIN empleados e ON ra.empleado_id = e.id
         INNER JOIN puntos_control pc ON ra.punto_control_id = pc.id
         WHERE ra.tipo = 'ENTRADA'
         AND ra.id = (
           SELECT id FROM registros_acceso
           WHERE empleado_id = e.id
           AND date(timestamp_registro) = date('now')
           ORDER BY timestamp_registro DESC LIMIT 1
         )
         ORDER BY ra.timestamp_registro ASC`,
      )
      .all() as Array<{
      id: string;
      codigo_empleado: string;
      nombre: string;
      apellido: string;
      departamento: string;
      punto_control_id: string;
      nombre_punto_control: string;
      timestamp_registro: string;
    }>;

    return rows.map((row) => {
      const horaEntrada = new Date(row.timestamp_registro);
      const minutosEnInstalacion = Math.max(0, Math.floor((Date.now() - horaEntrada.getTime()) / 60000));

      return {
        empleadoId: row.id,
        codigoEmpleado: row.codigo_empleado,
        nombreCompleto: `${row.nombre} ${row.apellido}`,
        departamento: row.departamento,
        puntoControlId: row.punto_control_id,
        nombrePuntoControl: row.nombre_punto_control,
        horaEntrada,
        minutosEnInstalacion,
      };
    });
  }

  async findByPuntoControl(puntoControlId: string, fecha: string): Promise<RegistroAcceso[]> {
    const rows = this.db
      .prepare(
        `SELECT * FROM registros_acceso
         WHERE punto_control_id = ?
           AND date(timestamp_registro) = date(?)
         ORDER BY timestamp_registro ASC`,
      )
      .all(puntoControlId, fecha) as RegistroAccesoRow[];

    return rows.map((row) => this.mapRowToRegistro(row));
  }

  private mapRowToRegistro(row: any): RegistroAcceso {
    return new RegistroAcceso({
      id: String(row.id),
      empleadoId: String(row.empleado_id),
      puntoControlId: String(row.punto_control_id),
      guardiaId: String(row.guardia_id),
      tipo: row.tipo as ETipoAcceso,
      timestampRegistro: new Date(row.timestamp_registro),
      observaciones: row.observaciones ? String(row.observaciones) : null,
      createdAt: new Date(row.created_at),
    });
  }
}
