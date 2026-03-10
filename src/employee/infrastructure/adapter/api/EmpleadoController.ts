import { Request, Response } from 'express';
import { ApiController } from '../../../../api/domain/model/ApiController';
import { ValidationError } from '../../../../shared/domain/DomainError';
import { EmpleadoFilters } from '../../../domain/model/EmpleadoFilters';
import { EmpleadoUsecasePort } from '../../../application/usecase/EmpleadoUsecasePort';

export class EmpleadoController extends ApiController {
  constructor(private readonly empleadoUsecase: EmpleadoUsecasePort) {
    super();
  }

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters: EmpleadoFilters = {
        departamento:
          typeof req.query.departamento === 'string' ? req.query.departamento : undefined,
        activo:
          typeof req.query.activo === 'string'
            ? req.query.activo.toLowerCase() === 'true'
            : undefined,
        page: typeof req.query.page === 'string' ? Number(req.query.page) : undefined,
        limit: typeof req.query.limit === 'string' ? Number(req.query.limit) : undefined,
      };

      const empleados = await this.empleadoUsecase.getAllEmpleados(filters);
      res.status(this.STATUS.OK).json(empleados);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const idOrCodigo = req.params.id;

      if (!idOrCodigo || Array.isArray(idOrCodigo)) {
        throw new ValidationError('id es obligatorio');
      }

      const empleado = await this.tryGetByIdOrCodigo(idOrCodigo);
      res.status(this.STATUS.OK).json(empleado);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  search = async (req: Request, res: Response): Promise<void> => {
    try {
      const query = req.query.q;

      if (typeof query !== 'string' || !query.trim()) {
        throw new ValidationError('El parámetro q es obligatorio');
      }

      const result = await this.empleadoUsecase.searchEmpleados(query.trim());
      res.status(this.STATUS.OK).json(result);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const created = await this.empleadoUsecase.createEmpleado(req.body);
      res.status(this.STATUS.CREATED).json(created);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;

      if (!id || Array.isArray(id)) {
        throw new ValidationError('id es obligatorio');
      }

      const updated = await this.empleadoUsecase.updateEmpleado(id, req.body);
      res.status(this.STATUS.OK).json(updated);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  deactivate = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;

      if (!id || Array.isArray(id)) {
        throw new ValidationError('id es obligatorio');
      }

      const result = await this.empleadoUsecase.deleteEmpleado(id);
      res.status(this.STATUS.OK).json({ success: result });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  private tryGetByIdOrCodigo = async (idOrCodigo: string) => {
    try {
      return await this.empleadoUsecase.getEmpleadoById(idOrCodigo);
    } catch (_error) {
      return this.empleadoUsecase.searchEmpleados(idOrCodigo).then((items) => {
        const exact = items.find((item) => item.getCodigoEmpleado() === idOrCodigo);

        if (!exact) {
          throw _error;
        }

        return exact;
      });
    }
  };
}
