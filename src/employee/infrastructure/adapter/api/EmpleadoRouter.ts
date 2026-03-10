import { ApiRouter } from '../../../../api/domain/model/ApiRouter';
import { ERole } from '../../../../auth/domain/model/ERole';
import { AuthMiddleware } from '../../../../auth/infrastructure/adapter/middleware/AuthMiddleware';
import { EmpleadoController } from './EmpleadoController';

export class EmpleadoRouter extends ApiRouter {
  constructor(private readonly controller: EmpleadoController) {
    super();
    this.routes();
  }

  routes(): void {
    /**
     * @openapi
     * /api/1.0/employees:
     *   get:
     *     summary: Listar empleados con filtros
     *     tags: [Employees]
      *     parameters:
      *       - in: query
      *         name: departamento
      *         schema:
      *           type: string
      *         description: Filtra por departamento exacto
      *       - in: query
      *         name: activo
      *         schema:
      *           type: boolean
      *         description: Filtra por estado activo/inactivo
      *       - in: query
      *         name: page
      *         schema:
      *           type: integer
      *           minimum: 1
      *         description: Número de página (si aplica)
      *       - in: query
      *         name: limit
      *         schema:
      *           type: integer
      *           minimum: 1
      *         description: Tamaño de página (si aplica)
      *     responses:
      *       200: { description: Lista de empleados }
     */
    this.router.get(
      '/api/1.0/employees',
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(ERole.GERENTE_RRHH, ERole.ADMINISTRADOR, ERole.GUARDIA_SEGURIDAD),
      this.controller.getAll,
    );

    /**
     * @openapi
     * /api/1.0/employees/search:
     *   get:
     *     summary: Buscar empleados por nombre, apellido o código
     *     tags: [Employees]
      *     parameters:
      *       - in: query
      *         name: q
      *         required: true
      *         schema:
      *           type: string
      *         description: Texto de búsqueda (nombre, apellido o código)
      *     responses:
      *       200: { description: Coincidencias encontradas }
      *       400: { description: Parámetro q faltante o inválido }
     */
    this.router.get(
      '/api/1.0/employees/search',
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(ERole.GUARDIA_SEGURIDAD, ERole.GERENTE_RRHH, ERole.ADMINISTRADOR),
      this.controller.search,
    );

    /**
     * @openapi
     * /api/1.0/employees/{id}:
     *   get:
     *     summary: Obtener empleado por id o código
     *     tags: [Employees]
      *     parameters:
      *       - in: path
      *         name: id
      *         required: true
      *         schema:
      *           type: string
      *         description: UUID del empleado o código de empleado
      *     responses:
      *       200: { description: Empleado encontrado }
      *       404: { description: Empleado no encontrado }
     */
    this.router.get('/api/1.0/employees/:id', AuthMiddleware.authenticate, this.controller.getById);

    /**
     * @openapi
     * /api/1.0/employees:
     *   post:
     *     summary: Crear empleado
     *     tags: [Employees]
      *     requestBody:
      *       required: true
      *       content:
      *         application/json:
      *           schema:
      *             type: object
      *             required:
      *               - codigoEmpleado
      *               - nombre
      *               - apellido
      *               - departamento
      *               - cargo
      *               - horaInicioLaboral
      *               - horaFinLaboral
      *             properties:
      *               usuarioId:
      *                 type: string
      *               codigoEmpleado:
      *                 type: string
      *               nombre:
      *                 type: string
      *               apellido:
      *                 type: string
      *               departamento:
      *                 type: string
      *               cargo:
      *                 type: string
      *               horaInicioLaboral:
      *                 type: string
      *                 example: "09:00"
      *               horaFinLaboral:
      *                 type: string
      *                 example: "17:00"
      *     responses:
      *       201: { description: Empleado creado }
      *       409: { description: Código de empleado duplicado }
     */
    this.router.post(
      '/api/1.0/employees',
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(ERole.GERENTE_RRHH, ERole.ADMINISTRADOR),
      this.controller.create,
    );

    /**
     * @openapi
     * /api/1.0/employees/{id}:
     *   put:
     *     summary: Actualizar empleado
     *     tags: [Employees]
      *     parameters:
      *       - in: path
      *         name: id
      *         required: true
      *         schema:
      *           type: string
      *         description: UUID del empleado
      *     requestBody:
      *       required: true
      *       content:
      *         application/json:
      *           schema:
      *             type: object
      *             properties:
      *               usuarioId:
      *                 type: string
      *               codigoEmpleado:
      *                 type: string
      *               nombre:
      *                 type: string
      *               apellido:
      *                 type: string
      *               departamento:
      *                 type: string
      *               cargo:
      *                 type: string
      *               horaInicioLaboral:
      *                 type: string
      *                 example: "08:30"
      *               horaFinLaboral:
      *                 type: string
      *                 example: "17:30"
      *               activo:
      *                 type: boolean
      *     responses:
      *       200: { description: Empleado actualizado }
      *       404: { description: Empleado no encontrado }
     */
    this.router.put(
      '/api/1.0/employees/:id',
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(ERole.GERENTE_RRHH, ERole.ADMINISTRADOR),
      this.controller.update,
    );

    /**
     * @openapi
     * /api/1.0/employees/{id}:
     *   delete:
     *     summary: Desactivar empleado (soft delete)
     *     tags: [Employees]
      *     parameters:
      *       - in: path
      *         name: id
      *         required: true
      *         schema:
      *           type: string
      *         description: UUID del empleado
      *     responses:
      *       200: { description: Empleado desactivado }
      *       400: { description: No se puede desactivar por reglas de negocio }
      *       404: { description: Empleado no encontrado }
     */
    this.router.delete(
      '/api/1.0/employees/:id',
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(ERole.GERENTE_RRHH, ERole.ADMINISTRADOR),
      this.controller.deactivate,
    );
  }
}
