const Database = require('better-sqlite3');
const crypto = require('crypto');

const empleadoId = process.argv[2];
const puntoControlId = process.argv[3];

if (!empleadoId || !puntoControlId) {
  process.stderr.write('Usage: node scripts/seed-report-data.js <empleadoId> <puntoControlId>\n');
  process.exit(1);
}

const db = new Database('data/control_acceso.db');
const guardiaRow = db
  .prepare("SELECT id FROM usuarios WHERE role = 'GUARDIA_SEGURIDAD' ORDER BY created_at ASC LIMIT 1")
  .get();

if (!guardiaRow) {
  process.stderr.write('No guardia user found\n');
  process.exit(1);
}

const guardiaId = guardiaRow.id;

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const y = yesterday.toISOString().slice(0, 10);
const today = new Date().toISOString().slice(0, 10);

const clearStmt = db.prepare(
  "DELETE FROM registros_acceso WHERE empleado_id = ? AND date(timestamp_registro) IN (date(?), date(?))",
);
const insertStmt = db.prepare(
  'INSERT INTO registros_acceso (id, empleado_id, punto_control_id, guardia_id, tipo, timestamp_registro, observaciones, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
);

const tx = db.transaction(() => {
  clearStmt.run(empleadoId, y, today);

  insertStmt.run(
    crypto.randomUUID(),
    empleadoId,
    puntoControlId,
    guardiaId,
    'ENTRADA',
    `${y}T09:00:00`,
    'seed asistencia',
    new Date().toISOString(),
  );

  insertStmt.run(
    crypto.randomUUID(),
    empleadoId,
    puntoControlId,
    guardiaId,
    'SALIDA',
    `${y}T17:00:00`,
    'seed asistencia',
    new Date().toISOString(),
  );

  insertStmt.run(
    crypto.randomUUID(),
    empleadoId,
    puntoControlId,
    guardiaId,
    'ENTRADA',
    `${today}T09:15:00`,
    'seed tardanza',
    new Date().toISOString(),
  );
});

tx();
process.stdout.write('seed-ok\n');
