import { Request, Response } from 'express';
import { ApiController } from '../../../../api/domain/model/ApiController';
import { ValidationError } from '../../../../shared/domain/DomainError';
import { ReporteUsecasePort } from '../../../application/usecase/ReporteUsecasePort';

export class ReporteController extends ApiController {
  constructor(private readonly usecase: ReporteUsecasePort) {
    super();
  }

  getReporteAsistencia = async (req: Request, res: Response): Promise<void> => {
    try {
      const { empleadoId, departamento, fechaInicio, fechaFin } = req.query as {
        empleadoId?: string;
        departamento?: string;
        fechaInicio?: string;
        fechaFin?: string;
      };

      if (!fechaInicio || !fechaFin) {
        throw new ValidationError('fechaInicio y fechaFin son obligatorios');
      }

      const result = await this.usecase.generarReporteAsistencia({
        empleadoId,
        departamento,
        fechaInicio,
        fechaFin,
      });

      res.status(this.STATUS.OK).json(result);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getReportePuntualidad = async (req: Request, res: Response): Promise<void> => {
    try {
      const { empleadoId, departamento, fechaInicio, fechaFin } = req.query as {
        empleadoId?: string;
        departamento?: string;
        fechaInicio?: string;
        fechaFin?: string;
      };

      if (!fechaInicio || !fechaFin) {
        throw new ValidationError('fechaInicio y fechaFin son obligatorios');
      }

      const result = await this.usecase.generarReportePuntualidad({
        empleadoId,
        departamento,
        fechaInicio,
        fechaFin,
      });

      res.status(this.STATUS.OK).json(result);
    } catch (error) {
      this.handleError(res, error);
    }
  };
}
