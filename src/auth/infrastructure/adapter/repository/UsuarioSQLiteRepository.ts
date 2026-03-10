import { v4 as uuidv4 } from 'uuid';
import { SQLiteDatabase } from '../../../../api/infrastructure/adapter/database/SQLiteDatabase';
import { ERole } from '../../../domain/model/ERole';
import { Usuario } from '../../../domain/model/Usuario';
import { UsuarioRepositoryPort } from '../../../domain/port/driven/repository/UsuarioRepositoryPort';

type UsuarioRow = {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  role: ERole;
  activo: number;
  created_at: string;
};

type UsuarioUpdate = Partial<{
  username: string;
  email: string;
  passwordHash: string;
  role: ERole;
  activo: boolean;
}>;

export class UsuarioSQLiteRepository implements UsuarioRepositoryPort {
  private readonly db = SQLiteDatabase.getInstance();

  async findById(id: string): Promise<Usuario | null> {
    const row = this.db
      .prepare('SELECT * FROM usuarios WHERE id = ? LIMIT 1')
      .get(id) as UsuarioRow | undefined;

    return row ? this.mapRowToUsuario(row) : null;
  }

  async findAll(): Promise<Usuario[]> {
    const rows = this.db
      .prepare('SELECT * FROM usuarios WHERE activo = 1 ORDER BY created_at DESC')
      .all() as UsuarioRow[];

    return rows.map((row) => this.mapRowToUsuario(row));
  }

  async findByUsername(username: string): Promise<Usuario | null> {
    const row = this.db
      .prepare('SELECT * FROM usuarios WHERE username = ? LIMIT 1')
      .get(username) as UsuarioRow | undefined;

    return row ? this.mapRowToUsuario(row) : null;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const row = this.db
      .prepare('SELECT * FROM usuarios WHERE email = ? LIMIT 1')
      .get(email) as UsuarioRow | undefined;

    return row ? this.mapRowToUsuario(row) : null;
  }

  async findByRole(role: ERole): Promise<Usuario[]> {
    const rows = this.db
      .prepare('SELECT * FROM usuarios WHERE role = ? AND activo = 1 ORDER BY created_at DESC')
      .all(role) as UsuarioRow[];

    return rows.map((row) => this.mapRowToUsuario(row));
  }

  async save(item: Usuario): Promise<Usuario> {
    const id = uuidv4();

    this.db.prepare(
      `INSERT INTO usuarios (id, username, email, password_hash, role, activo)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).run(
      id,
      item.getUsername(),
      item.getEmail(),
      item.getPasswordHash(),
      item.getRole(),
      item.getActivo() ? 1 : 0,
    );

    const created = await this.findById(id);

    if (!created) {
      throw new Error('No fue posible crear el usuario');
    }

    return created;
  }

  async update(id: string, item: Partial<Usuario>): Promise<Usuario | null> {
    const current = await this.findById(id);

    if (!current) {
      return null;
    }

    const updates = item as unknown as UsuarioUpdate;

    this.db.prepare(
      `UPDATE usuarios
       SET username = ?,
           email = ?,
           password_hash = ?,
           role = ?,
           activo = ?,
           updated_at = datetime('now')
       WHERE id = ?`,
    ).run(
      updates.username ?? current.getUsername(),
      updates.email ?? current.getEmail(),
      updates.passwordHash ?? current.getPasswordHash(),
      updates.role ?? current.getRole(),
      updates.activo !== undefined ? (updates.activo ? 1 : 0) : current.getActivo() ? 1 : 0,
      id,
    );

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = this.db.prepare(
      `UPDATE usuarios
       SET activo = 0,
           updated_at = datetime('now')
       WHERE id = ?`,
    ).run(id);

    return result.changes > 0;
  }

  private mapRowToUsuario(row: any): Usuario {
    return new Usuario({
      id: String(row.id),
      username: String(row.username),
      email: String(row.email),
      passwordHash: String(row.password_hash),
      role: row.role as ERole,
      activo: Number(row.activo) === 1,
      createdAt: new Date(row.created_at),
    });
  }
}
