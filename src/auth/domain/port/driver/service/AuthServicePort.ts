import { AuthToken } from '../../../../domain/model/AuthToken';
import { JwtPayloadInterface } from '../../../../domain/model/JwtPayloadInterface';

export interface AuthServicePort {
  login(username: string, password: string): Promise<AuthToken>;
  logout(token: string): Promise<void>;
  verifyToken(token: string): Promise<JwtPayloadInterface>;
  hashPassword(password: string): Promise<string>;
  comparePassword(plain: string, hash: string): Promise<boolean>;
}
