import { Repository } from '../../../../../shared/domain/Repository';
import { ERole } from '../../../../domain/model/ERole';
import { Usuario } from '../../../../domain/model/Usuario';

export interface UsuarioRepositoryPort extends Repository<string, Usuario> {
  findByUsername(username: string): Promise<Usuario | null>;
  findByEmail(email: string): Promise<Usuario | null>;
  findByRole(role: ERole): Promise<Usuario[]>;
}
