import { CreateUsuarioDto } from '../../../../domain/model/CreateUsuarioDto';
import { UpdateUsuarioDto } from '../../../../domain/model/UpdateUsuarioDto';
import { Usuario } from '../../../../domain/model/Usuario';

export interface UsuarioServicePort {
  createUsuario(data: CreateUsuarioDto): Promise<Usuario>;
  updateUsuario(id: string, data: UpdateUsuarioDto): Promise<Usuario>;
  deleteUsuario(id: string): Promise<boolean>;
  getUsuarioById(id: string): Promise<Usuario>;
  getAllUsuarios(): Promise<Usuario[]>;
  changePassword(id: string, oldPassword: string, newPassword: string): Promise<boolean>;
}
