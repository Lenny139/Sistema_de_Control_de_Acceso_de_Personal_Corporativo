import bcrypt from 'bcryptjs';
import { EmpleadoRepositoryPort } from '../../../employee/domain/repository/EmpleadoRepositoryPort';
import { DomainError } from '../../../shared/domain/errors/DomainError';
import { AuthPayload, AuthServicePort } from '../ports/AuthServicePort';
import { JwtService } from '../../infrastructure/security/JwtService';

export class AuthService implements AuthServicePort {
  constructor(
    private readonly empleadoRepository: EmpleadoRepositoryPort,
    private readonly jwtService: JwtService,
  ) {}

  readonly login = async (username: string, password: string): Promise<string> => {
    const user = await this.empleadoRepository.findByUsername(username);

    if (!user) {
      throw new DomainError('Credenciales inválidas');
    }

    const validPassword = await bcrypt.compare(password, user.getPasswordHash());

    if (!validPassword) {
      throw new DomainError('Credenciales inválidas');
    }

    const payload: AuthPayload = {
      userId: user.getId(),
      username: user.getUsername(),
      role: user.getRole(),
    };

    return this.jwtService.sign(payload);
  };

  readonly verify = async (token: string): Promise<AuthPayload> => {
    return this.jwtService.verify(token);
  };
}
