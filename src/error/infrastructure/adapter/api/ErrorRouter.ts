import { NextFunction, Request, Response } from 'express';
import { ApiRouter } from '../../../../api/domain/model/ApiRouter';
import { HTTPStatusCode } from '../../../../api/domain/status/HTTPStatusCode';
import { DomainError } from '../../../../shared/domain/DomainError';

export class ErrorRouter extends ApiRouter {
  constructor() {
    super();
    this.routes();
  }

  routes(): void {
    this.router.use((_req: Request, res: Response) => {
      res.status(HTTPStatusCode.NOT_FOUND).json({
        code: 'NOT_FOUND',
        message: 'Route not found',
      });
    });

    this.router.use(
      (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
        if (error instanceof DomainError) {
          res.status(error.statusCode).json({
            code: error.code,
            message: error.message,
          });
          return;
        }

        const isDevelopment = process.env.NODE_ENV === 'development';

        res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal server error',
          ...(isDevelopment
            ? {
                stack: error instanceof Error ? error.stack : String(error),
              }
            : {}),
        });
      },
    );
  }
}
