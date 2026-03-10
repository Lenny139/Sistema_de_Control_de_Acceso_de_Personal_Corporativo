import { Request, Response } from 'express';
import { ApiController } from '../../../../api/domain/model/ApiController';
import { ValidationError } from '../../../../shared/domain/DomainError';
import { AuthUsecasePort } from '../../../application/usecase/AuthUsecasePort';
import { LoginDto } from '../../../domain/model/LoginDto';
import { JwtPayloadInterface } from '../../../domain/model/JwtPayloadInterface';

type AuthenticatedRequest = Request & { user?: JwtPayloadInterface };

type ExtendedAuthUsecase = AuthUsecasePort & {
  logoutUser?: (token: string) => Promise<void>;
  changePassword?: (userId: string, oldPassword: string, newPassword: string) => Promise<boolean>;
};

export class AuthController extends ApiController {
  constructor(private readonly authUsecase: AuthUsecasePort) {
    super();
  }

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body as LoginDto;

      if (!username || !password) {
        throw new ValidationError('username y password son obligatorios');
      }

      const token = await this.authUsecase.loginUser({ username, password });
      res.status(this.STATUS.OK).json(token);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const authorization = req.headers.authorization;

      if (!authorization || !authorization.startsWith('Bearer ')) {
        throw new ValidationError('Authorization Bearer token requerido');
      }

      const token = authorization.slice(7);
      const usecase = this.authUsecase as ExtendedAuthUsecase;

      if (usecase.logoutUser) {
        await usecase.logoutUser(token);
      }

      res.status(this.STATUS.OK).json({ message: 'Logout exitoso' });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userPayload = (req as AuthenticatedRequest).user;

      if (!userPayload?.sub) {
        throw new ValidationError('Usuario autenticado no encontrado');
      }

      const usuario = await this.authUsecase.getProfile(userPayload.sub);
      res.status(this.STATUS.OK).json({
        id: usuario.getId(),
        username: usuario.getUsername(),
        email: usuario.getEmail(),
        role: usuario.getRole(),
        activo: usuario.getActivo(),
        createdAt: usuario.getCreatedAt(),
      });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const userPayload = (req as AuthenticatedRequest).user;
      const { oldPassword, newPassword } = req.body as {
        oldPassword?: string;
        newPassword?: string;
      };

      if (!userPayload?.sub) {
        throw new ValidationError('Usuario autenticado no encontrado');
      }

      if (!oldPassword || !newPassword) {
        throw new ValidationError('oldPassword y newPassword son obligatorios');
      }

      const usecase = this.authUsecase as ExtendedAuthUsecase;

      if (!usecase.changePassword) {
        throw new ValidationError('Operación no disponible');
      }

      await usecase.changePassword(userPayload.sub, oldPassword, newPassword);
      res.status(this.STATUS.OK).json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      this.handleError(res, error);
    }
  };
}
