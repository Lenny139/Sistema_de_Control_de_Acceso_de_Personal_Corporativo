import { ApiRouter } from '../../../../api/domain/model/ApiRouter';
import { ERole } from '../../../../auth/domain/model/ERole';
import { AuthMiddleware } from '../../../../auth/infrastructure/adapter/middleware/AuthMiddleware';
import { VisitanteController } from './VisitanteController';

export class VisitanteRouter extends ApiRouter {
  constructor(private readonly controller: VisitanteController) {
    super();
    this.routes();
  }

  routes(): void {
    /**
     * @openapi
     * /api/1.0/visitors:
     *   post:
     *     summary: Registrar entrada de visitante
     *     tags: [Visitors]
      *     requestBody:
      *       required: true
      *       content:
      *         application/json:
      *           schema:
      *             type: object
      *             required:
      *               - nombre
      *               - apellido
      *               - documentoIdentidad
      *               - empleadoAnfitrionId
      *               - puntoControlId
      *             properties:
      *               nombre:
      *                 type: string
      *               apellido:
      *                 type: string
      *               documentoIdentidad:
      *                 type: string
      *               empresa:
      *                 type: string
      *               empleadoAnfitrionId:
      *                 type: string
      *               puntoControlId:
      *                 type: string
      *               observaciones:
      *                 type: string
      *     responses:
      *       201: { description: Entrada de visitante registrada }
      *       400: { description: Datos inválidos }
      *       401: { description: No autorizado }
      *       403: { description: Sin permisos }
      *       409: { description: Visitante ya presente }
     */
    this.router.post(
      '/api/1.0/visitors',
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(ERole.GUARDIA_SEGURIDAD),
      this.controller.registrarEntrada,
    );

    /**
     * @openapi
     * /api/1.0/visitors/{id}/checkout:
     *   put:
     *     summary: Registrar salida de visitante
     *     tags: [Visitors]
      *     parameters:
      *       - in: path
      *         name: id
      *         required: true
      *         schema:
      *           type: string
      *         description: UUID del visitante
      *     responses:
      *       200: { description: Salida de visitante registrada }
      *       400: { description: Parámetro inválido }
      *       401: { description: No autorizado }
      *       403: { description: Sin permisos }
      *       404: { description: Visitante no encontrado }
      *       409: { description: Visitante ya tenía salida }
     */
    this.router.put(
      '/api/1.0/visitors/:id/checkout',
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(ERole.GUARDIA_SEGURIDAD),
      this.controller.registrarSalida,
    );

    /**
     * @openapi
     * /api/1.0/visitors/presentes:
     *   get:
     *     summary: Listar visitantes presentes
     *     tags: [Visitors]
      *     responses:
      *       200: { description: Lista de visitantes presentes }
      *       401: { description: No autorizado }
      *       403: { description: Sin permisos }
     */
    this.router.get(
      '/api/1.0/visitors/presentes',
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(ERole.GUARDIA_SEGURIDAD, ERole.GERENTE_RRHH),
      this.controller.getPresentes,
    );

    /**
     * @openapi
     * /api/1.0/visitors/historial:
     *   get:
     *     summary: Obtener historial de visitantes por rango de fechas
     *     tags: [Visitors]
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
      *     responses:
      *       200: { description: Historial de visitantes }
      *       400: { description: Faltan fechas requeridas }
      *       401: { description: No autorizado }
      *       403: { description: Sin permisos }
     */
    this.router.get(
      '/api/1.0/visitors/historial',
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(ERole.GERENTE_RRHH, ERole.ADMINISTRADOR),
      this.controller.getHistorial,
    );

    /**
     * @openapi
     * /api/1.0/visitors/{id}:
     *   get:
     *     summary: Obtener visitante por id
     *     tags: [Visitors]
      *     parameters:
      *       - in: path
      *         name: id
      *         required: true
      *         schema:
      *           type: string
      *         description: UUID del visitante
      *     responses:
      *       200: { description: Visitante encontrado }
      *       400: { description: Parámetro inválido }
      *       401: { description: No autorizado }
      *       403: { description: Sin permisos }
      *       404: { description: Visitante no encontrado }
     */
    this.router.get(
      '/api/1.0/visitors/:id',
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(ERole.GUARDIA_SEGURIDAD, ERole.GERENTE_RRHH, ERole.ADMINISTRADOR),
      this.controller.getById,
    );
  }
}
