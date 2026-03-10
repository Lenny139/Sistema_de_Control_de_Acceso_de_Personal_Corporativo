import { RouterBase } from '../../../api/infrastructure/http/RouterBase';
import { Role } from '../../../auth/domain/entities/Role';
import { requireAuth, requireRole } from '../../../auth/infrastructure/security/AuthMiddleware';
import { EmpleadoController } from './EmpleadoController';

export class EmpleadoRouter extends RouterBase {
  constructor(private readonly controller: EmpleadoController) {
    super();
  }

  protected initializeRoutes(): void {
    /**
     * @swagger
     * /api/v1/employees:
     *   get:
     *     summary: Listar empleados
     *     tags: [Employees]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de empleados
     */
    this.router.get('/', requireAuth, requireRole(Role.ADMINISTRADOR, Role.GERENTE_RRHH), (req, res) =>
      this.controller.execute(req, res),
    );

    /**
     * @swagger
     * /api/v1/employees:
     *   post:
     *     summary: Crear empleado
     *     tags: [Employees]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       201:
     *         description: Empleado creado
     */
    this.router.post('/', requireAuth, requireRole(Role.ADMINISTRADOR, Role.GERENTE_RRHH), (req, res) =>
      this.controller.execute(req, res),
    );
  }
}
