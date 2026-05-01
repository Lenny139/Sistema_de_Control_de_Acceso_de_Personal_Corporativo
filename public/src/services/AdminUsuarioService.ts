import { ApiClient } from '../core/ApiClient.js';
import { ERole } from '../models/Usuario.model.js';

export interface UsuarioAdmin {
  id: string;
  username: string;
  email: string;
  role: ERole;
  activo: boolean;
  createdAt?: string;
}

export interface CreateUsuarioDto {
  username: string;
  email: string;
  password: string;
  role: ERole;
}

export class AdminUsuarioService {
  private readonly api = new ApiClient();

  public getAll(): Promise<UsuarioAdmin[]> {
    return this.api.get<UsuarioAdmin[]>('/auth/users');
  }

  public create(dto: CreateUsuarioDto): Promise<UsuarioAdmin> {
    return this.api.post<UsuarioAdmin>('/auth/users', dto);
  }

  public update(id: string, data: Partial<UsuarioAdmin>): Promise<UsuarioAdmin> {
    return this.api.put<UsuarioAdmin>(`/auth/users/${id}`, data);
  }

  public deactivate(id: string): Promise<void> {
    return this.api.delete<void>(`/auth/users/${id}`);
  }
}
