import { Request, Response } from 'express';
import { ControllerBase } from '../../../api/infrastructure/http/ControllerBase';
import { AuthServicePort } from '../../application/ports/AuthServicePort';
import { DomainError } from '../../../shared/domain/errors/DomainError';

export class AuthController extends ControllerBase {
  constructor(private readonly authService: AuthServicePort) {
    super();
  }

  readonly execute = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body as {
        username?: string;
        password?: string;
      };

      if (!username || !password) {
        res.status(400).json({ message: 'username y password son requeridos' });
        return;
      }

      const token = await this.authService.login(username, password);
      res.status(200).json({ token });
    } catch (error) {
      const message = error instanceof DomainError ? error.message : 'Error interno';
      res.status(401).json({ message });
    }
  };
}
