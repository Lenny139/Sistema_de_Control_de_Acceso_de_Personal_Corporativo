import { ERole } from './ERole';

export interface CreateUsuarioDto {
  username: string;
  email: string;
  password: string;
  role: ERole;
}
