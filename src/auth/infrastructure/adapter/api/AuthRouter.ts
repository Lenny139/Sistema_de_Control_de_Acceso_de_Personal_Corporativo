import { ApiRouter } from '../../../../api/domain/model/ApiRouter';
import { AuthUsecasePort } from '../../../application/usecase/AuthUsecasePort';
import { AuthController } from './AuthController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

export class AuthRouter extends ApiRouter {
  private readonly controller: AuthController;

  constructor(authUsecase: AuthUsecasePort) {
    super();
    this.controller = new AuthController(authUsecase);
    this.routes();
  }

  routes(): void {
    /**
     * @openapi
     * /api/1.0/auth/login:
     *   post:
     *     summary: Iniciar sesión
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [username, password]
     *             properties:
     *               username: { type: string }
     *               password: { type: string }
     *     responses:
     *       200: { description: Login exitoso }
     *       401: { description: Credenciales inválidas }
     */
    this.router.post('/api/1.0/auth/login', this.controller.login);

    /**
     * @openapi
     * /api/1.0/auth/logout:
     *   post:
     *     summary: Cerrar sesión
     *     tags: [Auth]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200: { description: Logout exitoso }
     *       401: { description: No autorizado }
     */
    this.router.post('/api/1.0/auth/logout', AuthMiddleware.authenticate, this.controller.logout);

    /**
     * @openapi
     * /api/1.0/auth/profile:
     *   get:
     *     summary: Obtener perfil autenticado
     *     tags: [Auth]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200: { description: Perfil del usuario }
     *       401: { description: No autorizado }
     */
    this.router.get('/api/1.0/auth/profile', AuthMiddleware.authenticate, this.controller.getProfile);

    /**
     * @openapi
     * /api/1.0/auth/password:
     *   put:
     *     summary: Cambiar contraseña
     *     tags: [Auth]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [oldPassword, newPassword]
     *             properties:
     *               oldPassword: { type: string }
     *               newPassword: { type: string }
     *     responses:
     *       200: { description: Contraseña actualizada }
     *       400: { description: Datos inválidos }
     */
    this.router.put('/api/1.0/auth/password', AuthMiddleware.authenticate, this.controller.changePassword);
  }
}
