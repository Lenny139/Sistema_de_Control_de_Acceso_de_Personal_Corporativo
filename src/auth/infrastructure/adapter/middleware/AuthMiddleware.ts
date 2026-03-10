import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AuthService } from '../../../application/service/AuthService';
import { JwtPayloadInterface } from '../../../domain/model/JwtPayloadInterface';
import { ERole } from '../../../domain/model/ERole';
import { ForbiddenError, UnauthorizedError } from '../../../../shared/domain/DomainError';
import { UsuarioSQLiteRepository } from '../repository/UsuarioSQLiteRepository';

type AuthenticatedRequest = Request & { user?: JwtPayloadInterface };

export class AuthMiddleware {
  private static readonly authService = new AuthService(new UsuarioSQLiteRepository());

  static authenticate: RequestHandler = async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const authorization = req.headers.authorization;

      if (!authorization || !authorization.startsWith('Bearer ')) {
        throw new UnauthorizedError('Token de autenticación requerido');
      }

      const token = authorization.slice(7);
      const payload = await AuthMiddleware.authService.verifyToken(token);

      (req as AuthenticatedRequest).user = payload;
      next();
    } catch (error) {
      next(error);
    }
  };

  static authorize = (...roles: ERole[]): RequestHandler => {
    return (req: Request, _res: Response, next: NextFunction): void => {
      try {
        const payload = (req as AuthenticatedRequest).user;

        if (!payload) {
          throw new UnauthorizedError('Usuario no autenticado');
        }

        if (!roles.includes(payload.role)) {
          throw new ForbiddenError('No tiene permisos para realizar esta acción');
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  };
}
