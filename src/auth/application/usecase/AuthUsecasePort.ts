import { AuthToken } from '../../domain/model/AuthToken';
import { LoginDto } from '../../domain/model/LoginDto';
import { Usuario } from '../../domain/model/Usuario';

export interface AuthUsecasePort {
  loginUser(dto: LoginDto): Promise<AuthToken>;
  getProfile(userId: string): Promise<Usuario>;
}
