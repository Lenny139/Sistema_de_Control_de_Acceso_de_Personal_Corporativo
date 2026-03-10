import { Request, Response } from 'express';
import { ApiController } from '../../../../api/domain/model/ApiController';
import { ValidationError } from '../../../../shared/domain/DomainError';
import { CheckpointUsecasePort } from '../../../application/usecase/CheckpointUsecasePort';

export class CheckpointController extends ApiController {
  constructor(private readonly checkpointUsecase: CheckpointUsecasePort) {
    super();
  }

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const checkpoints = await this.checkpointUsecase.getAllCheckpoints();
      res.status(this.STATUS.OK).json(checkpoints);
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

      const checkpoint = await this.checkpointUsecase.getCheckpointById(id);
      res.status(this.STATUS.OK).json(checkpoint);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const created = await this.checkpointUsecase.createCheckpoint(req.body);
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

      const updated = await this.checkpointUsecase.updateCheckpoint(id, req.body);
      res.status(this.STATUS.OK).json(updated);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;

      if (!id || Array.isArray(id)) {
        throw new ValidationError('id es obligatorio');
      }

      const deleted = await this.checkpointUsecase.deleteCheckpoint(id);
      res.status(this.STATUS.OK).json({ success: deleted });
    } catch (error) {
      this.handleError(res, error);
    }
  };
}
