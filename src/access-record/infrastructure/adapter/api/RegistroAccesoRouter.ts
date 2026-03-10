import { ApiRouter } from '../../../../api/domain/model/ApiRouter';
import { ERole } from '../../../../auth/domain/model/ERole';
import { AuthMiddleware } from '../../../../auth/infrastructure/adapter/middleware/AuthMiddleware';
import { RegistroAccesoController } from './RegistroAccesoController';

export class RegistroAccesoRouter extends ApiRouter {
  constructor(private readonly controller: RegistroAccesoController) {
    super();
    this.routes();
  }

  routes(): void {
    /**
     * @openapi
     * /api/1.0/access-records/check-in:
     *   post:
     *     summary: Registrar entrada de empleado
     *     tags: [AccessRecords]
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             required: [empleadoId, puntoControlId]
    *             properties:
    *               empleadoId: { type: string }
    *               puntoControlId: { type: string }
    *               observaciones: { type: string }
    *     responses:
    *       201: { description: Entrada registrada }
    *       409: { description: Conflicto de estado }
     */
    this.router.post(
      '/api/1.0/access-records/check-in',
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(ERole.GUARDIA_SEGURIDAD),
      this.controller.checkIn,
    );

    /**
     * @openapi
     * /api/1.0/access-records/check-out:
     *   post:
     *     summary: Registrar salida de empleado
     *     tags: [AccessRecords]
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             required: [empleadoId, puntoControlId]
    *             properties:
    *               empleadoId: { type: string }
    *               puntoControlId: { type: string }
    *               observaciones: { type: string }
    *     responses:
    *       201: { description: Salida registrada }
    *       409: { description: Conflicto de estado }
     */
    this.router.post(
      '/api/1.0/access-records/check-out',
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(ERole.GUARDIA_SEGURIDAD),
      this.controller.checkOut,
    );

    /**
     * @openapi
     * /api/1.0/access-records/presentes:
     *   get:
     *     summary: Obtener empleados presentes en instalación
     *     tags: [AccessRecords]
      *     responses:
      *       200: { description: Lista de empleados presentes }
      *       401: { description: No autorizado }
      *       403: { description: Sin permisos }
     */
    this.router.get(
      '/api/1.0/access-records/presentes',
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(ERole.GUARDIA_SEGURIDAD, ERole.GERENTE_RRHH),
      this.controller.getPresentes,
    );

    /**
     * @openapi
     * /api/1.0/access-records/estado/{empleadoId}:
     *   get:
     *     summary: Obtener último estado del empleado
     *     tags: [AccessRecords]
      *     parameters:
      *       - in: path
      *         name: empleadoId
      *         required: true
      *         schema:
      *           type: string
      *         description: UUID del empleado
      *     responses:
      *       200: { description: Estado actual del empleado }
      *       400: { description: Parámetro inválido }
      *       401: { description: No autorizado }
     */
    this.router.get(
      '/api/1.0/access-records/estado/:empleadoId',
      AuthMiddleware.authenticate,
      this.controller.getEstado,
    );

    /**
     * @openapi
     * /api/1.0/access-records/historial:
     *   get:
     *     summary: Obtener historial de accesos por empleado
     *     tags: [AccessRecords]
      *     parameters:
      *       - in: query
      *         name: empleadoId
      *         required: true
      *         schema:
      *           type: string
      *         description: UUID del empleado
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
      *     responses:
      *       200: { description: Historial de accesos }
      *       400: { description: Faltan parámetros obligatorios }
      *       401: { description: No autorizado }
      *       403: { description: Sin permisos }
     */
    this.router.get(
      '/api/1.0/access-records/historial',
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(ERole.GERENTE_RRHH, ERole.ADMINISTRADOR),
      this.controller.getHistorial,
    );
  }
}
