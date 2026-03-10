import { ApiRouter } from '../../../../api/domain/model/ApiRouter';
import { ERole } from '../../../../auth/domain/model/ERole';
import { AuthMiddleware } from '../../../../auth/infrastructure/adapter/middleware/AuthMiddleware';
import { CheckpointController } from './CheckpointController';

export class CheckpointRouter extends ApiRouter {
  constructor(private readonly controller: CheckpointController) {
    super();
    this.routes();
  }

  routes(): void {
    /**
     * @openapi
     * /api/1.0/checkpoints:
     *   get:
     *     summary: Listar puntos de control
     *     tags: [Checkpoints]
      *     responses:
      *       200: { description: Lista de puntos de control }
      *       401: { description: No autorizado }
     */
    this.router.get('/api/1.0/checkpoints', AuthMiddleware.authenticate, this.controller.getAll);

    /**
     * @openapi
     * /api/1.0/checkpoints/{id}:
     *   get:
     *     summary: Obtener punto de control por id
     *     tags: [Checkpoints]
      *     parameters:
      *       - in: path
      *         name: id
      *         required: true
      *         schema:
      *           type: string
      *         description: UUID del punto de control
      *     responses:
      *       200: { description: Punto de control encontrado }
      *       400: { description: Parámetro inválido }
      *       401: { description: No autorizado }
      *       404: { description: Punto de control no encontrado }
     */
    this.router.get('/api/1.0/checkpoints/:id', AuthMiddleware.authenticate, this.controller.getById);

    /**
     * @openapi
     * /api/1.0/checkpoints:
     *   post:
     *     summary: Crear punto de control
     *     tags: [Checkpoints]
      *     requestBody:
      *       required: true
      *       content:
      *         application/json:
      *           schema:
      *             type: object
      *             required: [nombre]
      *             properties:
      *               nombre:
      *                 type: string
      *               descripcion:
      *                 type: string
      *     responses:
      *       201: { description: Punto de control creado }
      *       400: { description: Datos inválidos }
      *       401: { description: No autorizado }
      *       403: { description: Sin permisos }
      *       409: { description: Nombre duplicado }
     */
    this.router.post(
      '/api/1.0/checkpoints',
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(ERole.ADMINISTRADOR),
      this.controller.create,
    );

    /**
     * @openapi
     * /api/1.0/checkpoints/{id}:
     *   put:
     *     summary: Actualizar punto de control
     *     tags: [Checkpoints]
      *     parameters:
      *       - in: path
      *         name: id
      *         required: true
      *         schema:
      *           type: string
      *         description: UUID del punto de control
      *     requestBody:
      *       required: true
      *       content:
      *         application/json:
      *           schema:
      *             type: object
      *             properties:
      *               nombre:
      *                 type: string
      *               descripcion:
      *                 type: string
      *     responses:
      *       200: { description: Punto de control actualizado }
      *       400: { description: Datos inválidos }
      *       401: { description: No autorizado }
      *       403: { description: Sin permisos }
      *       404: { description: Punto de control no encontrado }
     */
    this.router.put(
      '/api/1.0/checkpoints/:id',
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(ERole.ADMINISTRADOR),
      this.controller.update,
    );

    /**
     * @openapi
     * /api/1.0/checkpoints/{id}:
     *   delete:
     *     summary: Eliminar (soft) punto de control
     *     tags: [Checkpoints]
      *     parameters:
      *       - in: path
      *         name: id
      *         required: true
      *         schema:
      *           type: string
      *         description: UUID del punto de control
      *     responses:
      *       200: { description: Punto de control desactivado }
      *       400: { description: Parámetro inválido }
      *       401: { description: No autorizado }
      *       403: { description: Sin permisos }
      *       404: { description: Punto de control no encontrado }
     */
    this.router.delete(
      '/api/1.0/checkpoints/:id',
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(ERole.ADMINISTRADOR),
      this.controller.delete,
    );
  }
}
