export type ERole = 'ADMINISTRADOR' | 'GERENTE_RRHH' | 'GUARDIA_SEGURIDAD' | 'EMPLEADO';

export interface UsuarioAuth {
  id: string;
  username: string;
  role: ERole;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
  user: UsuarioAuth;
}
