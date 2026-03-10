import { v4 as uuidv4 } from 'uuid';
import { ConflictError, NotFoundError, UnauthorizedError } from '../../../shared/domain/DomainError';
import { CreateUsuarioDto } from '../../domain/model/CreateUsuarioDto';
import { UpdateUsuarioDto } from '../../domain/model/UpdateUsuarioDto';
import { Usuario } from '../../domain/model/Usuario';
import { AuthServicePort } from '../../domain/port/driver/service/AuthServicePort';
import { UsuarioServicePort } from '../../domain/port/driver/service/UsuarioServicePort';
import { UsuarioRepositoryPort } from '../../domain/port/driven/repository/UsuarioRepositoryPort';

export class UsuarioService implements UsuarioServicePort {
  constructor(
    private readonly usuarioRepository: UsuarioRepositoryPort,
    private readonly authService: AuthServicePort,
  ) {}

  async createUsuario(data: CreateUsuarioDto): Promise<Usuario> {
    const usernameExists = await this.usuarioRepository.findByUsername(data.username);

    if (usernameExists) {
      throw new ConflictError('El username ya existe');
    }

    const emailExists = await this.usuarioRepository.findByEmail(data.email);

    if (emailExists) {
      throw new ConflictError('El email ya existe');
    }

    const passwordHash = await this.authService.hashPassword(data.password);
    const usuario = new Usuario({
      id: uuidv4(),
      username: data.username,
      email: data.email,
      passwordHash,
      role: data.role,
      activo: true,
      createdAt: new Date(),
    });

    return (this.usuarioRepository as unknown as { save(item: Usuario): Promise<Usuario> }).save(usuario);
  }

  async updateUsuario(id: string, data: UpdateUsuarioDto): Promise<Usuario> {
    const existingUsuario = await this.usuarioRepository.findById(id);

    if (!existingUsuario) {
      throw new NotFoundError('Usuario no encontrado');
    }

    const updated = await (this.usuarioRepository as unknown as {
      update(userId: string, item: Partial<Usuario>): Promise<Usuario | null>;
    }).update(id, {
      username: data.username,
      email: data.email,
      role: data.role,
      activo: data.activo,
    } as unknown as Partial<Usuario>);

    if (!updated) {
      throw new NotFoundError('Usuario no encontrado');
    }

    return updated;
  }

  async deleteUsuario(id: string): Promise<boolean> {
    const existingUsuario = await this.usuarioRepository.findById(id);

    if (!existingUsuario) {
      throw new NotFoundError('Usuario no encontrado');
    }

    return (this.usuarioRepository as unknown as { delete(userId: string): Promise<boolean> }).delete(id);
  }

  async getUsuarioById(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findById(id);

    if (!usuario) {
      throw new NotFoundError('Usuario no encontrado');
    }

    return usuario;
  }

  async getAllUsuarios(): Promise<Usuario[]> {
    return this.usuarioRepository.findAll();
  }

  async changePassword(id: string, oldPassword: string, newPassword: string): Promise<boolean> {
    const usuario = await this.usuarioRepository.findById(id);

    if (!usuario) {
      throw new NotFoundError('Usuario no encontrado');
    }

    const validOldPassword = await this.authService.comparePassword(
      oldPassword,
      usuario.getPasswordHash(),
    );

    if (!validOldPassword) {
      throw new UnauthorizedError('Contraseña actual incorrecta');
    }

    const newHash = await this.authService.hashPassword(newPassword);

    const updated = await (this.usuarioRepository as unknown as {
      update(userId: string, item: Partial<Usuario>): Promise<Usuario | null>;
    }).update(id, {
      passwordHash: newHash,
    } as unknown as Partial<Usuario>);

    return updated !== null;
  }
}
