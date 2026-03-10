import { ApiRouter } from '../../../../api/domain/model/ApiRouter';
import { ERole } from '../../../../auth/domain/model/ERole';
import { AuthMiddleware } from '../../../../auth/infrastructure/adapter/middleware/AuthMiddleware';
import { AuditController } from './AuditController';

export class AuditRouter extends ApiRouter {
  constructor(private readonly controller: AuditController) {
    super();
    this.routes();
  }

  routes(): void {
    /**
     * @openapi
     * /api/1.0/audit:
     *   get:
     *     summary: Obtener logs de auditoría por rango
     *     tags: [Audit]
      *     parameters:
      *       - in: query
      *         name: fechaInicio
      *         required: true
      *         schema:
      *           type: string
      *           format: date
      *         description: Fecha inicial (YYYY-MM-DD)
      *       - in: query
      *         name: fechaFin
      *         required: true
      *         schema:
      *           type: string
      *           format: date
      *         description: Fecha final (YYYY-MM-DD)
      *       - in: query
      *         name: limit
      *         required: false
      *         schema:
      *           type: integer
      *           minimum: 1
      *           default: 100
      *         description: Máximo de registros a devolver
      *     responses:
      *       200: { description: Logs de auditoría por rango }
      *       400: { description: Faltan parámetros requeridos }
      *       401: { description: No autorizado }
      *       403: { description: Sin permisos }
     */
    this.router.get(
      '/api/1.0/audit',
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(ERole.ADMINISTRADOR),
      this.controller.getLogs,
    );

    /**
     * @openapi
     * /api/1.0/audit/user/{userId}:
     *   get:
     *     summary: Obtener logs de auditoría por usuario
     *     tags: [Audit]
      *     parameters:
      *       - in: path
      *         name: userId
      *         required: true
      *         schema:
      *           type: string
      *         description: UUID del usuario a consultar
      *       - in: query
      *         name: limit
      *         required: false
      *         schema:
      *           type: integer
      *           minimum: 1
      *           default: 100
      *         description: Máximo de registros a devolver
      *     responses:
      *       200: { description: Logs de auditoría por usuario }
      *       400: { description: Parámetros inválidos }
      *       401: { description: No autorizado }
      *       403: { description: Sin permisos }
     */
    this.router.get(
      '/api/1.0/audit/user/:userId',
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(ERole.ADMINISTRADOR),
      this.controller.getLogsByUser,
    );
  }
}
