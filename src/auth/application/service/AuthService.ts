import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { EnvironmentProvider } from '../../../api/infrastructure/provider/EnvironmentProvider';
import { EAccionAudit, EEntidadAudit } from '../../../audit/domain/model/AbstractAuditLog';
import { AuditServiceSingleton } from '../../../audit/infrastructure/factory/AuditServiceSingleton';
import { ForbiddenError, UnauthorizedError } from '../../../shared/domain/DomainError';
import { AuthToken } from '../../domain/model/AuthToken';
import { JwtPayloadInterface } from '../../domain/model/JwtPayloadInterface';
import { AuthServicePort } from '../../domain/port/driver/service/AuthServicePort';
import { UsuarioRepositoryPort } from '../../domain/port/driven/repository/UsuarioRepositoryPort';

export class AuthService implements AuthServicePort {
  constructor(private readonly usuarioRepository: UsuarioRepositoryPort) {}

  async login(username: string, password: string): Promise<AuthToken> {
    const usuario = await this.usuarioRepository.findByUsername(username);

    if (!usuario) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    const isPasswordValid = await this.comparePassword(password, usuario.getPasswordHash());

    if (!isPasswordValid) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    if (!usuario.getActivo()) {
      throw new ForbiddenError('Usuario inactivo');
    }

    const payload: JwtPayloadInterface = {
      sub: usuario.getId(),
      username: usuario.getUsername(),
      role: usuario.getRole(),
    };

    const environment = EnvironmentProvider.getInstance();
    const expiresIn = environment.getJwtExpiresIn();
    const accessToken = jwt.sign(payload, environment.getJwtSecret(), {
      expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
    });

    await AuditServiceSingleton.getInstance().log({
      usuarioId: usuario.getId(),
      accion: EAccionAudit.LOGIN,
      entidad: EEntidadAudit.USUARIO,
      entidadId: usuario.getId(),
      datosNuevos: {
        username: usuario.getUsername(),
        role: usuario.getRole(),
      },
    });

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn,
      user: {
        id: usuario.getId(),
        username: usuario.getUsername(),
        role: usuario.getRole(),
      },
    };
  }

  async logout(token: string): Promise<void> {
    await this.verifyToken(token);
  }

  async verifyToken(token: string): Promise<JwtPayloadInterface> {
    try {
      const environment = EnvironmentProvider.getInstance();
      const payload = jwt.verify(token, environment.getJwtSecret()) as JwtPayloadInterface;
      return payload;
    } catch (_error) {
      throw new UnauthorizedError('Token inválido o expirado');
    }
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
