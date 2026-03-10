import { Response } from 'express';
import { HTTPStatusCode } from '../status/HTTPStatusCode';
import { DomainError } from '../../../shared/domain/DomainError';

export abstract class ApiController {
  protected readonly STATUS = HTTPStatusCode;

  protected handleError(res: Response, error: unknown): void {
    if (error instanceof DomainError) {
      res.status(error.statusCode).json({
        code: error.code,
        message: error.message,
      });
      return;
    }

    res.status(this.STATUS.INTERNAL_SERVER_ERROR).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error',
    });
  }
}
