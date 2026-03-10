import jwt from 'jsonwebtoken';
import { EnvironmentProvider } from '../../api/infrastructure/provider/EnvironmentProvider';
import request from 'supertest';
import { SQLiteDatabase } from '../../api/infrastructure/adapter/database/SQLiteDatabase';
import { Server } from '../../api/infrastructure/adapter/express/Server';
import { AuthFactory } from '../../auth/infrastructure/factory/AuthFactory';
import { ErrorRouter } from '../../error/infrastructure/adapter/api/ErrorRouter';

describe('Auth Integration', () => {
  const server = new Server();
  server.useRouter(AuthFactory.create());
  server.useRouter(new ErrorRouter());
  const app = server.getApp();

  beforeAll(() => {
    SQLiteDatabase.getInstance();
  });

  const getAdminToken = (): string => {
    const db = SQLiteDatabase.getInstance();
    const admin = db
      .prepare('SELECT id, username, role FROM usuarios WHERE username = ? LIMIT 1')
      .get('admin') as { id: string; username: string; role: string };

    const secret = EnvironmentProvider.getInstance().getJwtSecret();
    return jwt.sign({ sub: admin.id, username: admin.username, role: admin.role }, secret);
  };

  it('POST /api/1.0/auth/login debe retornar JWT con credenciales válidas', async () => {
    const response = await request(app).post('/api/1.0/auth/login').send({
      username: 'admin',
      password: 'admin123',
    });

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.tokenType).toBe('Bearer');
  });

  it('POST /api/1.0/auth/login debe retornar 401 con credenciales inválidas', async () => {
    const response = await request(app).post('/api/1.0/auth/login').send({
      username: 'admin',
      password: 'bad-password',
    });

    expect(response.status).toBe(401);
  });

  it('GET /api/1.0/auth/profile debe retornar 401 sin token', async () => {
    const response = await request(app).get('/api/1.0/auth/profile');

    expect(response.status).toBe(401);
  });

  it('GET /api/1.0/auth/profile debe retornar el perfil con token válido', async () => {
    const token = getAdminToken();

    const response = await request(app)
      .get('/api/1.0/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe('admin');
    expect(response.body.role).toBe('ADMINISTRADOR');
  });
});
