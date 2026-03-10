import { Request, Response } from 'express';
import { ApiController } from '../../../../api/domain/model/ApiController';
import { ValidationError } from '../../../../shared/domain/DomainError';
import { AuditServiceSingleton } from '../../factory/AuditServiceSingleton';

export class AuditController extends ApiController {
  private readonly auditService = AuditServiceSingleton.getInstance();

  getLogs = async (req: Request, res: Response): Promise<void> => {
    try {
      const fechaInicio = req.query.fechaInicio;
      const fechaFin = req.query.fechaFin;
      const limit = req.query.limit;

      if (typeof fechaInicio !== 'string' || typeof fechaFin !== 'string') {
        throw new ValidationError('fechaInicio y fechaFin son obligatorios');
      }

      const parsedLimit = typeof limit === 'string' ? Number(limit) : 100;
      const logs = await this.auditService.getLogsByRango(fechaInicio, fechaFin, parsedLimit);

      res.status(this.STATUS.OK).json(logs);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getLogsByUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;
      const limit = req.query.limit;

      if (!userId || Array.isArray(userId)) {
        throw new ValidationError('userId es obligatorio');
      }

      const parsedLimit = typeof limit === 'string' ? Number(limit) : 100;
      const logs = await this.auditService.getLogsByUsuario(userId, parsedLimit);

      res.status(this.STATUS.OK).json(logs);
    } catch (error) {
      this.handleError(res, error);
    }
  };
}
