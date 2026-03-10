import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { EnvironmentProvider } from '../../provider/EnvironmentProvider';

type UserRole = 'ADMINISTRADOR' | 'GERENTE_RRHH' | 'GUARDIA_SEGURIDAD' | 'EMPLEADO';

export class SQLiteDatabase {
  private static instance: Database.Database | null = null;

  public static getInstance(): Database.Database {
    if (!SQLiteDatabase.instance) {
      const environment = EnvironmentProvider.getInstance();
      const dbPath = path.resolve(process.cwd(), environment.getDbPath());

      SQLiteDatabase.instance = new Database(dbPath);
      SQLiteDatabase.instance.pragma('foreign_keys = ON');
      SQLiteDatabase.instance.pragma('journal_mode = WAL');

      SQLiteDatabase.initialize();
      SQLiteDatabase.seedDatabase();
    }

    return SQLiteDatabase.instance;
  }

  public static initialize(): void {
    const db = SQLiteDatabase.getInstance();

    db.exec(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('ADMINISTRADOR','GERENTE_RRHH','GUARDIA_SEGURIDAD','EMPLEADO')),
        activo INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS empleados (
        id TEXT PRIMARY KEY,
        usuario_id TEXT REFERENCES usuarios(id),
        codigo_empleado TEXT UNIQUE NOT NULL,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        departamento TEXT NOT NULL,
        cargo TEXT NOT NULL,
        hora_inicio_laboral TEXT NOT NULL DEFAULT '09:00',
        hora_fin_laboral TEXT NOT NULL DEFAULT '17:00',
        activo INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS puntos_control (
        id TEXT PRIMARY KEY,
        nombre TEXT UNIQUE NOT NULL,
        descripcion TEXT,
        activo INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS registros_acceso (
        id TEXT PRIMARY KEY,
        empleado_id TEXT NOT NULL REFERENCES empleados(id),
        punto_control_id TEXT NOT NULL REFERENCES puntos_control(id),
        guardia_id TEXT NOT NULL REFERENCES usuarios(id),
        tipo TEXT NOT NULL CHECK(tipo IN ('ENTRADA','SALIDA')),
        timestamp_registro TEXT NOT NULL DEFAULT (datetime('now')),
        observaciones TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS visitantes (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        documento_identidad TEXT NOT NULL,
        empresa TEXT,
        empleado_anfitrion_id TEXT NOT NULL REFERENCES empleados(id),
        guardia_id TEXT NOT NULL REFERENCES usuarios(id),
        punto_control_id TEXT NOT NULL REFERENCES puntos_control(id),
        hora_entrada TEXT NOT NULL,
        hora_salida TEXT,
        fecha_visita TEXT NOT NULL DEFAULT (date('now')),
        observaciones TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS audit_log (
        id TEXT PRIMARY KEY,
        usuario_id TEXT REFERENCES usuarios(id),
        accion TEXT NOT NULL,
        entidad TEXT NOT NULL,
        entidad_id TEXT,
        datos_anteriores TEXT,
        datos_nuevos TEXT,
        ip_address TEXT,
        timestamp TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE INDEX IF NOT EXISTS idx_registros_acceso_empleado_id ON registros_acceso(empleado_id);
      CREATE INDEX IF NOT EXISTS idx_registros_acceso_timestamp_registro ON registros_acceso(timestamp_registro);
      CREATE INDEX IF NOT EXISTS idx_registros_acceso_tipo ON registros_acceso(tipo);

      CREATE INDEX IF NOT EXISTS idx_visitantes_empleado_anfitrion_id ON visitantes(empleado_anfitrion_id);
      CREATE INDEX IF NOT EXISTS idx_visitantes_fecha_visita ON visitantes(fecha_visita);

      CREATE INDEX IF NOT EXISTS idx_audit_log_usuario_id ON audit_log(usuario_id);
      CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit_log(timestamp);
    `);
  }

  public static seedDatabase(): void {
    const db = SQLiteDatabase.getInstance();

    const ensureUser = (
      username: string,
      email: string,
      plainPassword: string,
      role: UserRole,
    ): string => {
      const existingUser = db
        .prepare('SELECT id FROM usuarios WHERE username = ? LIMIT 1')
        .get(username) as { id: string } | undefined;

      if (existingUser) {
        return existingUser.id;
      }

      const id = uuidv4();
      const passwordHash = bcrypt.hashSync(plainPassword, 10);

      db.prepare(
        `INSERT INTO usuarios (id, username, email, password_hash, role, activo)
         VALUES (?, ?, ?, ?, ?, 1)`,
      ).run(id, username, email, passwordHash, role);

      return id;
    };

    const ensureEmpleado = (
      usuarioId: string,
      codigoEmpleado: string,
      nombre: string,
      apellido: string,
      departamento: string,
      cargo: string,
    ): string => {
      const existingEmployee = db
        .prepare('SELECT id FROM empleados WHERE codigo_empleado = ? LIMIT 1')
        .get(codigoEmpleado) as { id: string } | undefined;

      if (existingEmployee) {
        return existingEmployee.id;
      }

      const empleadoId = uuidv4();

      db.prepare(
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
        ) VALUES (?, ?, ?, ?, ?, ?, ?, '09:00', '17:00', 1)`,
      ).run(empleadoId, usuarioId, codigoEmpleado, nombre, apellido, departamento, cargo);

      return empleadoId;
    };

    const ensurePuntoControl = (nombre: string, descripcion: string): void => {
      const existing = db
        .prepare('SELECT id FROM puntos_control WHERE nombre = ? LIMIT 1')
        .get(nombre) as { id: string } | undefined;

      if (existing) {
        return;
      }

      db.prepare(
        `INSERT INTO puntos_control (id, nombre, descripcion, activo)
         VALUES (?, ?, ?, 1)`,
      ).run(uuidv4(), nombre, descripcion);
    };

    const transaction = db.transaction(() => {
      ensureUser('admin', 'admin@control-acceso.local', 'admin123', 'ADMINISTRADOR');
      ensureUser('gerente', 'gerente@control-acceso.local', 'gerente123', 'GERENTE_RRHH');
      ensureUser('guardia1', 'guardia1@control-acceso.local', 'guardia123', 'GUARDIA_SEGURIDAD');
      ensureUser('guardia2', 'guardia2@control-acceso.local', 'guardia123', 'GUARDIA_SEGURIDAD');

      const empleadoUser1 = ensureUser(
        'empleado1',
        'empleado1@control-acceso.local',
        'empleado123',
        'EMPLEADO',
      );
      const empleadoUser2 = ensureUser(
        'empleado2',
        'empleado2@control-acceso.local',
        'empleado123',
        'EMPLEADO',
      );
      const empleadoUser3 = ensureUser(
        'empleado3',
        'empleado3@control-acceso.local',
        'empleado123',
        'EMPLEADO',
      );

      ensureEmpleado(
        empleadoUser1,
        'EMP-001',
        'Carlos',
        'Ramírez',
        'Tecnología',
        'Desarrollador Backend',
      );
      ensureEmpleado(
        empleadoUser2,
        'EMP-002',
        'Laura',
        'Gómez',
        'Recursos Humanos',
        'Analista RRHH',
      );
      ensureEmpleado(
        empleadoUser3,
        'EMP-003',
        'Andrés',
        'Martínez',
        'Operaciones',
        'Coordinador Operativo',
      );

      ensurePuntoControl('Entrada Principal', 'Acceso peatonal principal del edificio');
      ensurePuntoControl('Entrada Parking', 'Acceso vehicular y de parking');
    });

    transaction();
  }
}
