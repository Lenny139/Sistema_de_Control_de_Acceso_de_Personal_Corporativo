import { Role } from '../../../auth/domain/entities/Role';
import { Empleado } from '../../domain/entities/Empleado';
import { EmpleadoRepositoryPort } from '../../domain/repository/EmpleadoRepositoryPort';
import { SqliteDatabase } from '../../../shared/infrastructure/persistence/SqliteDatabase';

export class SqliteEmpleadoRepository implements EmpleadoRepositoryPort {
  constructor() {
    const db = SqliteDatabase.getInstance();
    db.exec(`
      CREATE TABLE IF NOT EXISTS empleados (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL
      );
    `);
  }

  readonly save = async (entity: Empleado): Promise<void> => {
    const db = SqliteDatabase.getInstance();
    const stmt = db.prepare(
      `INSERT OR REPLACE INTO empleados (id, nombre, username, password_hash, role) VALUES (?, ?, ?, ?, ?)`,
    );

    stmt.run(
      entity.getId(),
      entity.getNombre(),
      entity.getUsername(),
      entity.getPasswordHash(),
      entity.getRole(),
    );
  };

  readonly deleteById = async (id: string): Promise<void> => {
    const db = SqliteDatabase.getInstance();
    db.prepare('DELETE FROM empleados WHERE id = ?').run(id);
  };

  readonly findById = async (id: string): Promise<Empleado | null> => {
    const db = SqliteDatabase.getInstance();
    const row = db.prepare('SELECT * FROM empleados WHERE id = ?').get(id) as
      | { id: string; nombre: string; username: string; password_hash: string; role: Role }
      | undefined;

    if (!row) {
      return null;
    }

    return new Empleado(row.id, row.nombre, row.username, row.password_hash, row.role);
  };

  readonly findByUsername = async (username: string): Promise<Empleado | null> => {
    const db = SqliteDatabase.getInstance();
    const row = db.prepare('SELECT * FROM empleados WHERE username = ?').get(username) as
      | { id: string; nombre: string; username: string; password_hash: string; role: Role }
      | undefined;

    if (!row) {
      return null;
    }

    return new Empleado(row.id, row.nombre, row.username, row.password_hash, row.role);
  };

  readonly findAll = async (): Promise<Empleado[]> => {
    const db = SqliteDatabase.getInstance();
    const rows = db.prepare('SELECT * FROM empleados').all() as Array<{
      id: string;
      nombre: string;
      username: string;
      password_hash: string;
      role: Role;
    }>;

    return rows.map(
      (row) => new Empleado(row.id, row.nombre, row.username, row.password_hash, row.role),
    );
  };
}
