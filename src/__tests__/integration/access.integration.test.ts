import jwt from 'jsonwebtoken';
import { EnvironmentProvider } from '../../api/infrastructure/provider/EnvironmentProvider';
import request from 'supertest';
import { SQLiteDatabase } from '../../api/infrastructure/adapter/database/SQLiteDatabase';
import { Server } from '../../api/infrastructure/adapter/express/Server';
import { AccessRecordFactory } from '../../access-record/infrastructure/factory/AccessRecordFactory';
import { AuthFactory } from '../../auth/infrastructure/factory/AuthFactory';
import { ErrorRouter } from '../../error/infrastructure/adapter/api/ErrorRouter';
import { ReporteFactory } from '../../report/infrastructure/factory/ReporteFactory';

describe('Access Integration', () => {
  const server = new Server();
  server.useRouter(AuthFactory.create());
  server.useRouter(AccessRecordFactory.create());
  server.useRouter(ReporteFactory.create());
  server.useRouter(new ErrorRouter());
  const app = server.getApp();

  const db = SQLiteDatabase.getInstance();

  const getTokenByUsername = (username: string): string => {
    const user = db
      .prepare('SELECT id, username, role FROM usuarios WHERE username = ? LIMIT 1')
      .get(username) as { id: string; username: string; role: string };

    const secret = EnvironmentProvider.getInstance().getJwtSecret();
    return jwt.sign({ sub: user.id, username: user.username, role: user.role }, secret);
  };

  const getFixtureIds = (): { empleadoId: string; puntoControlId: string } => {
    const empleado = db
      .prepare('SELECT id FROM empleados WHERE activo = 1 ORDER BY created_at ASC LIMIT 1')
      .get() as { id: string };

    const checkpoint = db
      .prepare('SELECT id FROM puntos_control WHERE activo = 1 ORDER BY created_at ASC LIMIT 1')
      .get() as { id: string };

    return {
      empleadoId: empleado.id,
      puntoControlId: checkpoint.id,
    };
  };

  const today = (): string => new Date().toISOString().slice(0, 10);

  const clearTodayRecords = (empleadoId: string): void => {
    db.prepare("DELETE FROM registros_acceso WHERE empleado_id = ? AND date(timestamp_registro) = date('now')")
      .run(empleadoId);
  };

  it('POST /check-in debe registrar entrada correctamente (guardia autenticado)', async () => {
    const guardiaToken = getTokenByUsername('guardia1');
    const { empleadoId, puntoControlId } = getFixtureIds();
    clearTodayRecords(empleadoId);

    const response = await request(app)
      .post('/api/1.0/access-records/check-in')
      .set('Authorization', `Bearer ${guardiaToken}`)
      .send({ empleadoId, puntoControlId, observaciones: 'Ingreso test' });

    expect(response.status).toBe(201);
    expect(response.body.tipo).toBe('ENTRADA');
  });

  it('POST /check-in debe retornar 403 si no es guardia', async () => {
    const gerenteToken = getTokenByUsername('gerente');
    const { empleadoId, puntoControlId } = getFixtureIds();

    const response = await request(app)
      .post('/api/1.0/access-records/check-in')
      .set('Authorization', `Bearer ${gerenteToken}`)
      .send({ empleadoId, puntoControlId });

    expect(response.status).toBe(403);
  });

  it('POST /check-out debe registrar salida correctamente', async () => {
    const guardiaToken = getTokenByUsername('guardia1');
    const { empleadoId, puntoControlId } = getFixtureIds();
    clearTodayRecords(empleadoId);

    await request(app)
      .post('/api/1.0/access-records/check-in')
      .set('Authorization', `Bearer ${guardiaToken}`)
      .send({ empleadoId, puntoControlId });

    const response = await request(app)
      .post('/api/1.0/access-records/check-out')
      .set('Authorization', `Bearer ${guardiaToken}`)
      .send({ empleadoId, puntoControlId });

    expect(response.status).toBe(201);
    expect(response.body.tipo).toBe('SALIDA');
  });

  it('GET /presentes debe retornar lista de presentes', async () => {
    const guardiaToken = getTokenByUsername('guardia1');

    const response = await request(app)
      .get('/api/1.0/access-records/presentes')
      .set('Authorization', `Bearer ${guardiaToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /reports/asistencia debe retornar 403 para guardia', async () => {
    const guardiaToken = getTokenByUsername('guardia1');

    const response = await request(app)
      .get('/api/1.0/reports/asistencia')
      .set('Authorization', `Bearer ${guardiaToken}`)
      .query({ fechaInicio: today(), fechaFin: today() });

    expect(response.status).toBe(403);
  });

  it('GET /reports/asistencia debe retornar reporte para gerente RRHH', async () => {
    const gerenteToken = getTokenByUsername('gerente');

    const response = await request(app)
      .get('/api/1.0/reports/asistencia')
      .set('Authorization', `Bearer ${gerenteToken}`)
      .query({ fechaInicio: today(), fechaFin: today() });

    expect(response.status).toBe(200);
    expect(response.body.tipo).toBe('ASISTENCIA');
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
