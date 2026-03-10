import { SQLiteDatabase } from '../../../../api/infrastructure/adapter/database/SQLiteDatabase';
import { Checkpoint } from '../../../domain/model/Checkpoint';
import { CheckpointRepositoryPort } from '../../../domain/port/driven/repository/CheckpointRepositoryPort';

type CheckpointRow = {
  id: string;
  nombre: string;
  descripcion: string | null;
  activo: number;
  created_at: string;
};

type CheckpointUpdate = Partial<{
  nombre: string;
  descripcion?: string;
  activo: boolean;
}>;

export class CheckpointSQLiteRepository implements CheckpointRepositoryPort {
  private readonly db = SQLiteDatabase.getInstance();

  async findById(id: string): Promise<Checkpoint | null> {
    const row = this.db
      .prepare('SELECT * FROM puntos_control WHERE id = ? LIMIT 1')
      .get(id) as CheckpointRow | undefined;

    return row ? this.mapRowToCheckpoint(row) : null;
  }

  async findAll(): Promise<Checkpoint[]> {
    const rows = this.db
      .prepare('SELECT * FROM puntos_control ORDER BY created_at DESC')
      .all() as CheckpointRow[];

    return rows.map((row) => this.mapRowToCheckpoint(row));
  }

  async findByNombre(nombre: string): Promise<Checkpoint | null> {
    const row = this.db
      .prepare('SELECT * FROM puntos_control WHERE nombre = ? LIMIT 1')
      .get(nombre) as CheckpointRow | undefined;

    return row ? this.mapRowToCheckpoint(row) : null;
  }

  async findActivos(): Promise<Checkpoint[]> {
    const rows = this.db
      .prepare('SELECT * FROM puntos_control WHERE activo = 1 ORDER BY created_at DESC')
      .all() as CheckpointRow[];

    return rows.map((row) => this.mapRowToCheckpoint(row));
  }

  async save(item: Checkpoint): Promise<Checkpoint> {
    this.db.prepare(
      `INSERT INTO puntos_control (id, nombre, descripcion, activo)
       VALUES (?, ?, ?, ?)`,
    ).run(item.getId(), item.getNombre(), item.getDescripcion() ?? null, item.getActivo() ? 1 : 0);

    const created = await this.findById(item.getId());

    if (!created) {
      throw new Error('No fue posible crear el punto de control');
    }

    return created;
  }

  async update(id: string, item: Partial<Checkpoint>): Promise<Checkpoint | null> {
    const current = await this.findById(id);

    if (!current) {
      return null;
    }

    const updates = item as unknown as CheckpointUpdate;

    this.db.prepare(
      `UPDATE puntos_control
       SET nombre = ?,
           descripcion = ?,
           activo = ?
       WHERE id = ?`,
    ).run(
      updates.nombre ?? current.getNombre(),
      updates.descripcion ?? current.getDescripcion() ?? null,
      updates.activo !== undefined ? (updates.activo ? 1 : 0) : current.getActivo() ? 1 : 0,
      id,
    );

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = this.db.prepare('UPDATE puntos_control SET activo = 0 WHERE id = ?').run(id);
    return result.changes > 0;
  }

  private mapRowToCheckpoint(row: any): Checkpoint {
    return new Checkpoint({
      id: String(row.id),
      nombre: String(row.nombre),
      descripcion: row.descripcion ? String(row.descripcion) : undefined,
      activo: Number(row.activo) === 1,
      createdAt: new Date(row.created_at),
    });
  }
}
