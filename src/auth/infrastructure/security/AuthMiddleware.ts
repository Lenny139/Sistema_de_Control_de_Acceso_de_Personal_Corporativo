import { NextFunction, Request, Response } from 'express';
import { Role } from '../../domain/entities/Role';
import { JwtService } from './JwtService';

export interface AuthenticatedRequest extends Request {
  user?: {
    readonly userId: string;
    readonly username: string;
    readonly role: Role;
  };
}

const jwtService = new JwtService();

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token requerido' });
    return;
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    req.user = jwtService.verify(token);
    next();
  } catch (_error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

export const requireRole = (...roles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'No autorizado' });
      return;
    }

    next();
  };
};
