import { ApiRouter } from '../../../../api/domain/model/ApiRouter';
import { ERole } from '../../../../auth/domain/model/ERole';
import { AuthMiddleware } from '../../../../auth/infrastructure/adapter/middleware/AuthMiddleware';
import { ReporteController } from './ReporteController';

export class ReporteRouter extends ApiRouter {
  constructor(private readonly controller: ReporteController) {
    super();
    this.routes();
  }

  routes(): void {
    /**
     * @openapi
     * /api/1.0/reports/asistencia:
     *   get:
     *     summary: Generar reporte de asistencia
     *     tags: [Reports]
    *     parameters:
    *       - in: query
    *         name: empleadoId
    *         schema: { type: string }
    *       - in: query
    *         name: departamento
    *         schema: { type: string }
    *       - in: query
    *         name: fechaInicio
    *         required: true
    *         schema: { type: string, format: date }
    *       - in: query
    *         name: fechaFin
    *         required: true
    *         schema: { type: string, format: date }
    *     responses:
    *       200: { description: Reporte de asistencia generado }
    *       403: { description: Sin permisos }
     */
    this.router.get(
      '/api/1.0/reports/asistencia',
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(ERole.GERENTE_RRHH, ERole.ADMINISTRADOR),
      this.controller.getReporteAsistencia,
    );

    /**
     * @openapi
     * /api/1.0/reports/puntualidad:
     *   get:
     *     summary: Generar reporte de puntualidad
     *     tags: [Reports]
    *     parameters:
    *       - in: query
    *         name: empleadoId
    *         schema: { type: string }
    *       - in: query
    *         name: departamento
    *         schema: { type: string }
    *       - in: query
    *         name: fechaInicio
    *         required: true
    *         schema: { type: string, format: date }
    *       - in: query
    *         name: fechaFin
    *         required: true
    *         schema: { type: string, format: date }
    *     responses:
    *       200: { description: Reporte de puntualidad generado }
    *       403: { description: Sin permisos }
     */
    this.router.get(
      '/api/1.0/reports/puntualidad',
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(ERole.GERENTE_RRHH, ERole.ADMINISTRADOR),
      this.controller.getReportePuntualidad,
    );
  }
}
