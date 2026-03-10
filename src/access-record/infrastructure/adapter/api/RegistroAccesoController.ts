import { Request, Response } from 'express';
import { ApiController } from '../../../../api/domain/model/ApiController';
import { ValidationError } from '../../../../shared/domain/DomainError';
import { JwtPayloadInterface } from '../../../../auth/domain/model/JwtPayloadInterface';
import { RegistroAccesoUsecasePort } from '../../../application/usecase/RegistroAccesoUsecasePort';

type AuthRequest = Request & { user?: JwtPayloadInterface };

export class RegistroAccesoController extends ApiController {
  constructor(private readonly usecase: RegistroAccesoUsecasePort) {
    super();
  }

  checkIn = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as AuthRequest).user;
      const { empleadoId, puntoControlId, observaciones } = req.body as {
        empleadoId?: string;
        puntoControlId?: string;
        observaciones?: string;
      };

      if (!user?.sub) {
        throw new ValidationError('Usuario autenticado inválido');
      }

      if (!empleadoId || !puntoControlId) {
        throw new ValidationError('empleadoId y puntoControlId son obligatorios');
      }

      const created = await this.usecase.checkIn({
        empleadoId,
        puntoControlId,
        guardiaId: user.sub,
        observaciones,
      });

      res.status(this.STATUS.CREATED).json(created);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  checkOut = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as AuthRequest).user;
      const { empleadoId, puntoControlId, observaciones } = req.body as {
        empleadoId?: string;
        puntoControlId?: string;
        observaciones?: string;
      };

      if (!user?.sub) {
        throw new ValidationError('Usuario autenticado inválido');
      }

      if (!empleadoId || !puntoControlId) {
        throw new ValidationError('empleadoId y puntoControlId son obligatorios');
      }

      const created = await this.usecase.checkOut({
        empleadoId,
        puntoControlId,
        guardiaId: user.sub,
        observaciones,
      });

      res.status(this.STATUS.CREATED).json(created);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getPresentes = async (_req: Request, res: Response): Promise<void> => {
    try {
      const presentes = await this.usecase.getDashboardPresentes();
      res.status(this.STATUS.OK).json(presentes);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getHistorial = async (req: Request, res: Response): Promise<void> => {
    try {
      const { empleadoId, fechaInicio, fechaFin } = req.query as {
        empleadoId?: string;
        fechaInicio?: string;
        fechaFin?: string;
      };

      if (!empleadoId || !fechaInicio || !fechaFin) {
        throw new ValidationError('empleadoId, fechaInicio y fechaFin son obligatorios');
      }

      const historial = await this.usecase.getHistorialEmpleado(empleadoId, fechaInicio, fechaFin);
      res.status(this.STATUS.OK).json(historial);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getEstado = async (req: Request, res: Response): Promise<void> => {
    try {
      const empleadoId = req.params.empleadoId;

      if (!empleadoId || Array.isArray(empleadoId)) {
        throw new ValidationError('empleadoId es obligatorio');
      }

      const estado = await this.usecase.getEstadoEmpleado(empleadoId);
      res.status(this.STATUS.OK).json({ empleadoId, estado });
    } catch (error) {
      this.handleError(res, error);
    }
  };
}
