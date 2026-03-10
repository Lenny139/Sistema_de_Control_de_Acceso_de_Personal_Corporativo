import { Request, Response } from 'express';
import { JwtPayloadInterface } from '../../../../auth/domain/model/JwtPayloadInterface';
import { ApiController } from '../../../../api/domain/model/ApiController';
import { ValidationError } from '../../../../shared/domain/DomainError';
import { VisitanteUsecasePort } from '../../../application/usecase/VisitanteUsecasePort';

type AuthRequest = Request & { user?: JwtPayloadInterface };

export class VisitanteController extends ApiController {
  constructor(private readonly usecase: VisitanteUsecasePort) {
    super();
  }

  registrarEntrada = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as AuthRequest).user;

      if (!user?.sub) {
        throw new ValidationError('Usuario autenticado inválido');
      }

      const created = await this.usecase.registrarEntrada({
        ...req.body,
        guardiaId: user.sub,
      });

      res.status(this.STATUS.CREATED).json(created);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  registrarSalida = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as AuthRequest).user;
      const id = req.params.id;

      if (!id || Array.isArray(id)) {
        throw new ValidationError('id es obligatorio');
      }

      if (!user?.sub) {
        throw new ValidationError('Usuario autenticado inválido');
      }

      const updated = await this.usecase.registrarSalida(id, user.sub);
      res.status(this.STATUS.OK).json(updated);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getPresentes = async (_req: Request, res: Response): Promise<void> => {
    try {
      const visitantes = await this.usecase.getPresentes();
      res.status(this.STATUS.OK).json(visitantes);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getHistorial = async (req: Request, res: Response): Promise<void> => {
    try {
      const fechaInicio = req.query.fechaInicio;
      const fechaFin = req.query.fechaFin;

      if (
        typeof fechaInicio !== 'string' ||
        !fechaInicio ||
        typeof fechaFin !== 'string' ||
        !fechaFin
      ) {
        throw new ValidationError('fechaInicio y fechaFin son obligatorios');
      }

      const historial = await this.usecase.getHistorial(fechaInicio, fechaFin);
      res.status(this.STATUS.OK).json(historial);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;

      if (!id || Array.isArray(id)) {
        throw new ValidationError('id es obligatorio');
      }

      const visitante = await this.usecase.getById(id);
      res.status(this.STATUS.OK).json(visitante);
    } catch (error) {
      this.handleError(res, error);
    }
  };
}
