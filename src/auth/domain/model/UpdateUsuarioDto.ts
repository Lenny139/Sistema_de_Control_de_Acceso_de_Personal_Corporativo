import { ERole } from './ERole';

export type UpdateUsuarioDto = Partial<{
  username: string;
  email: string;
  role: ERole;
  activo: boolean;
}>;
