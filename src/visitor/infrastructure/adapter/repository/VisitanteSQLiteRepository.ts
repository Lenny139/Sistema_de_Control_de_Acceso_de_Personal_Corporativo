import { SQLiteDatabase } from '../../../../api/infrastructure/adapter/database/SQLiteDatabase';
import { Visitante } from '../../../domain/model/Visitante';
import { VisitanteRepositoryPort } from '../../../domain/port/driven/repository/VisitanteRepositoryPort';

type VisitanteRow = {
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
};

type VisitanteUpdate = Partial<{
  nombre: string;
  apellido: string;
  documentoIdentidad: string;
  empresa?: string;
  empleadoAnfitrionId: string;
  guardiaId: string;
  puntoControlId: string;
  horaEntrada: Date;
  horaSalida: Date | null;
  fechaVisita: string;
  observaciones?: string;
}>;

export class VisitanteSQLiteRepository implements VisitanteRepositoryPort {
  private readonly db = SQLiteDatabase.getInstance();

  async findById(id: string): Promise<Visitante | null> {
    const row = this.db
      .prepare('SELECT * FROM visitantes WHERE id = ? LIMIT 1')
      .get(id) as VisitanteRow | undefined;

    return row ? this.mapRowToVisitante(row) : null;
  }

  async findAll(): Promise<Visitante[]> {
    const rows = this.db
      .prepare('SELECT * FROM visitantes ORDER BY created_at DESC')
      .all() as VisitanteRow[];

    return rows.map((row) => this.mapRowToVisitante(row));
  }

  async save(item: Visitante): Promise<Visitante> {
    this.db.prepare(
      `INSERT INTO visitantes (
        id,
        nombre,
        apellido,
        documento_identidad,
        empresa,
        empleado_anfitrion_id,
        guardia_id,
        punto_control_id,
        hora_entrada,
        hora_salida,
        fecha_visita,
        observaciones,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      item.getId(),
      item.getNombre(),
      item.getApellido(),
      item.getDocumentoIdentidad(),
      item.getEmpresa() ?? null,
      item.getEmpleadoAnfitrionId(),
      item.getGuardiaId(),
      item.getPuntoControlId(),
      item.getHoraEntrada().toISOString(),
      item.getHoraSalida() ? item.getHoraSalida()!.toISOString() : null,
      item.getFechaVisita(),
      item.getObservaciones() ?? null,
      item.getCreatedAt().toISOString(),
    );

    const created = await this.findById(item.getId());

    if (!created) {
      throw new Error('No fue posible registrar el visitante');
    }

    return created;
  }

  async update(id: string, item: Partial<Visitante>): Promise<Visitante | null> {
    const current = await this.findById(id);

    if (!current) {
      return null;
    }

    const updates = item as unknown as VisitanteUpdate;

    this.db.prepare(
      `UPDATE visitantes
       SET nombre = ?,
           apellido = ?,
           documento_identidad = ?,
           empresa = ?,
           empleado_anfitrion_id = ?,
           guardia_id = ?,
           punto_control_id = ?,
           hora_entrada = ?,
           hora_salida = ?,
           fecha_visita = ?,
           observaciones = ?
       WHERE id = ?`,
    ).run(
      updates.nombre ?? current.getNombre(),
      updates.apellido ?? current.getApellido(),
      updates.documentoIdentidad ?? current.getDocumentoIdentidad(),
      updates.empresa ?? current.getEmpresa() ?? null,
      updates.empleadoAnfitrionId ?? current.getEmpleadoAnfitrionId(),
      updates.guardiaId ?? current.getGuardiaId(),
      updates.puntoControlId ?? current.getPuntoControlId(),
      (updates.horaEntrada ?? current.getHoraEntrada()).toISOString(),
      (updates.horaSalida ?? current.getHoraSalida())
        ? (updates.horaSalida ?? current.getHoraSalida())!.toISOString()
        : null,
      updates.fechaVisita ?? current.getFechaVisita(),
      updates.observaciones ?? current.getObservaciones() ?? null,
      id,
    );

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = this.db.prepare('DELETE FROM visitantes WHERE id = ?').run(id);
    return result.changes > 0;
  }

  async findByFecha(fecha: string): Promise<Visitante[]> {
    const rows = this.db
      .prepare('SELECT * FROM visitantes WHERE fecha_visita = ? ORDER BY hora_entrada DESC')
      .all(fecha) as VisitanteRow[];

    return rows.map((row) => this.mapRowToVisitante(row));
  }

  async findPresentes(): Promise<Visitante[]> {
    const rows = this.db
      .prepare(
        `SELECT * FROM visitantes
         WHERE hora_salida IS NULL
           AND fecha_visita = date('now')
         ORDER BY hora_entrada ASC`,
      )
      .all() as VisitanteRow[];

    return rows.map((row) => this.mapRowToVisitante(row));
  }

  async findByEmpleadoAnfitrion(empleadoId: string): Promise<Visitante[]> {
    const rows = this.db
      .prepare(
        `SELECT * FROM visitantes
         WHERE empleado_anfitrion_id = ?
         ORDER BY fecha_visita DESC, hora_entrada DESC`,
      )
      .all(empleadoId) as VisitanteRow[];

    return rows.map((row) => this.mapRowToVisitante(row));
  }

  async findByDocumento(documento: string, fecha: string): Promise<Visitante | null> {
    const row = this.db
      .prepare(
        `SELECT * FROM visitantes
         WHERE documento_identidad = ?
           AND fecha_visita = ?
         ORDER BY hora_entrada DESC
         LIMIT 1`,
      )
      .get(documento, fecha) as VisitanteRow | undefined;

    return row ? this.mapRowToVisitante(row) : null;
  }

  private mapRowToVisitante(row: any): Visitante {
    return new Visitante({
      id: String(row.id),
      nombre: String(row.nombre),
      apellido: String(row.apellido),
      documentoIdentidad: String(row.documento_identidad),
      empresa: row.empresa ? String(row.empresa) : undefined,
      empleadoAnfitrionId: String(row.empleado_anfitrion_id),
      guardiaId: String(row.guardia_id),
      puntoControlId: String(row.punto_control_id),
      horaEntrada: new Date(row.hora_entrada),
      horaSalida: row.hora_salida ? new Date(row.hora_salida) : null,
      fechaVisita: String(row.fecha_visita),
      observaciones: row.observaciones ? String(row.observaciones) : undefined,
      createdAt: new Date(row.created_at),
    });
  }
}
