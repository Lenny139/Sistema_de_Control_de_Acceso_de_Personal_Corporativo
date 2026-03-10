import jwt from 'jsonwebtoken';
import { DomainError } from '../../../shared/domain/errors/DomainError';
import { AuthPayload } from '../../application/ports/AuthServicePort';

export class JwtService {
  private readonly secret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET ?? 'dev_secret';
  }

  readonly sign = (payload: AuthPayload): string =>
    jwt.sign(payload, this.secret, { expiresIn: '8h' });

  readonly verify = (token: string): AuthPayload => {
    try {
      return jwt.verify(token, this.secret) as AuthPayload;
    } catch (_error) {
      throw new DomainError('Token inválido o expirado');
    }
  };
}
