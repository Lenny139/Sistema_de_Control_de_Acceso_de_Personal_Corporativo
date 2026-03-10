import { RouterBase } from '../../../api/infrastructure/http/RouterBase';
import { AuthController } from './AuthController';

export class AuthRouter extends RouterBase {
  constructor(private readonly controller: AuthController) {
    super();
  }

  protected initializeRoutes(): void {
    /**
     * @swagger
     * /api/v1/auth/login:
     *   post:
     *     summary: Iniciar sesión
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *     responses:
     *       200:
     *         description: JWT válido
     */
    this.router.post('/login', (req, res) => this.controller.execute(req, res));
  }
}
