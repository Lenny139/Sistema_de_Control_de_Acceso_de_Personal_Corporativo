import { AuthToken } from '../../domain/model/AuthToken';
import { LoginDto } from '../../domain/model/LoginDto';
import { Usuario } from '../../domain/model/Usuario';
import { AuthServicePort } from '../../domain/port/driver/service/AuthServicePort';
import { UsuarioServicePort } from '../../domain/port/driver/service/UsuarioServicePort';
import { AuthUsecasePort } from './AuthUsecasePort';

export class AuthUsecase implements AuthUsecasePort {
  constructor(
    private readonly authService: AuthServicePort,
    private readonly usuarioService: UsuarioServicePort,
  ) {}

  async loginUser(dto: LoginDto): Promise<AuthToken> {
    return this.authService.login(dto.username, dto.password);
  }

  async getProfile(userId: string): Promise<Usuario> {
    return this.usuarioService.getUsuarioById(userId);
  }

  async logoutUser(token: string): Promise<void> {
    await this.authService.logout(token);
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
    return this.usuarioService.changePassword(userId, oldPassword, newPassword);
  }
}
